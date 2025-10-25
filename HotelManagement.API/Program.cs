using HotelManagement.Core.Interfaces;
using HotelManagement.Core.Services;
using HotelManagement.Infrastructure.Data;
using HotelManagement.Infrastructure.Repositories;
using HotelManagement.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/hotel-management-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger/OpenAPI
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Hotel Management API",
        Version = "v1",
        Description = "A comprehensive hotel management system API"
    });

    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure Entity Framework
builder.Services.AddDbContext<HotelDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JWT Authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Key not configured"));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// Register services
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Configure AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Hotel Management API v1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Ensure database is created and seeded
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<HotelDbContext>();
    context.Database.EnsureCreated();
    
    // Seed initial data
    await SeedDataAsync(context);
}

app.Run();

static async Task SeedDataAsync(HotelDbContext context)
{
    if (!context.Users.Any())
    {
        // Create admin user
        var adminUser = new User
        {
            FirstName = "Admin",
            LastName = "User",
            Email = "admin@hotel.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            IsActive = true
        };

        context.Users.Add(adminUser);
        await context.SaveChangesAsync();

        // Create room types
        var roomTypes = new[]
        {
            new RoomType
            {
                Name = "Standard Room",
                Description = "Comfortable room with basic amenities",
                BasePrice = 100.00m,
                MaxOccupancy = 2,
                Size = 25,
                Amenities = "WiFi, TV, Air Conditioning, Mini Bar",
                IsActive = true
            },
            new RoomType
            {
                Name = "Deluxe Room",
                Description = "Spacious room with premium amenities",
                BasePrice = 150.00m,
                MaxOccupancy = 3,
                Size = 35,
                Amenities = "WiFi, TV, Air Conditioning, Mini Bar, Balcony, Room Service",
                IsActive = true
            },
            new RoomType
            {
                Name = "Suite",
                Description = "Luxurious suite with separate living area",
                BasePrice = 250.00m,
                MaxOccupancy = 4,
                Size = 60,
                Amenities = "WiFi, TV, Air Conditioning, Mini Bar, Balcony, Room Service, Jacuzzi, Kitchenette",
                IsActive = true
            }
        };

        context.RoomTypes.AddRange(roomTypes);
        await context.SaveChangesAsync();

        // Create rooms
        var rooms = new List<Room>();
        for (int floor = 1; floor <= 5; floor++)
        {
            for (int roomNum = 1; roomNum <= 20; roomNum++)
            {
                var roomTypeId = (roomNum % 3) + 1; // Distribute room types
                rooms.Add(new Room
                {
                    RoomNumber = $"{floor}{roomNum:D2}",
                    Floor = floor,
                    RoomTypeId = roomTypeId,
                    Status = RoomStatus.Available,
                    IsActive = true
                });
            }
        }

        context.Rooms.AddRange(rooms);
        await context.SaveChangesAsync();

        // Create sample guests
        var guests = new[]
        {
            new Guest
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@email.com",
                PhoneNumber = "+1234567890",
                Address = "123 Main St, City, State",
                Nationality = "American",
                PassportNumber = "A1234567",
                DateOfBirth = new DateTime(1985, 5, 15),
                Gender = "Male",
                IsVip = false
            },
            new Guest
            {
                FirstName = "Jane",
                LastName = "Smith",
                Email = "jane.smith@email.com",
                PhoneNumber = "+1234567891",
                Address = "456 Oak Ave, City, State",
                Nationality = "Canadian",
                PassportNumber = "C7654321",
                DateOfBirth = new DateTime(1990, 8, 22),
                Gender = "Female",
                IsVip = true
            }
        };

        context.Guests.AddRange(guests);
        await context.SaveChangesAsync();

        // Create sample services
        var services = new[]
        {
            new Service
            {
                Name = "Room Service",
                Description = "In-room dining service",
                Price = 25.00m,
                Category = ServiceCategory.Food,
                IsActive = true
            },
            new Service
            {
                Name = "Spa Treatment",
                Description = "Relaxing spa and wellness treatment",
                Price = 80.00m,
                Category = ServiceCategory.Spa,
                IsActive = true
            },
            new Service
            {
                Name = "Laundry Service",
                Description = "Professional laundry and dry cleaning",
                Price = 15.00m,
                Category = ServiceCategory.Laundry,
                IsActive = true
            },
            new Service
            {
                Name = "Airport Transfer",
                Description = "Complimentary airport pickup and drop-off",
                Price = 50.00m,
                Category = ServiceCategory.Transportation,
                IsActive = true
            }
        };

        context.Services.AddRange(services);
        await context.SaveChangesAsync();
    }
}