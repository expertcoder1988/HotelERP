# ===============================================
# Enable Remote Desktop on Windows 11 Pro Laptops
# ===============================================
# This script enables Remote Desktop and configures firewall rules
# Run this script as Administrator on each laptop you want to access remotely

param(
    [switch]$SkipConfirmation
)

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Enabling Remote Desktop on this laptop..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# Function to check if a command was successful
function Test-CommandSuccess {
    param($CommandName, $Result)
    if ($Result) {
        Write-Host "✅ $CommandName - Success" -ForegroundColor Green
        return $true
    } else {
        Write-Host "❌ $CommandName - Failed" -ForegroundColor Red
        return $false
    }
}

# Step 1: Enable Remote Desktop
Write-Host "`n1️⃣ Enabling Remote Desktop..." -ForegroundColor Yellow
try {
    Set-ItemProperty -Path "HKLM:\System\CurrentControlSet\Control\Terminal Server" -Name fDenyTSConnections -Value 0 -Force
    Write-Host "✅ Remote Desktop enabled in registry" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to enable Remote Desktop in registry: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Configure Windows Firewall
Write-Host "`n2️⃣ Configuring Windows Firewall..." -ForegroundColor Yellow
try {
    # Enable Remote Desktop firewall rules
    Enable-NetFirewallRule -DisplayGroup "Remote Desktop" -ErrorAction Stop
    Write-Host "✅ Remote Desktop firewall rules enabled" -ForegroundColor Green
    
    # Also ensure the specific RDP rule is enabled
    Enable-NetFirewallRule -DisplayName "Remote Desktop (TCP-In)" -ErrorAction SilentlyContinue
    Write-Host "✅ RDP TCP-In rule enabled" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to configure firewall: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 3: Configure and Start Remote Desktop Service
Write-Host "`n3️⃣ Configuring Remote Desktop Service..." -ForegroundColor Yellow
try {
    # Set service to start automatically
    Set-Service -Name TermService -StartupType Automatic -ErrorAction Stop
    Write-Host "✅ Remote Desktop service set to start automatically" -ForegroundColor Green
    
    # Start the service
    Start-Service -Name TermService -ErrorAction Stop
    Write-Host "✅ Remote Desktop service started" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to configure/start Remote Desktop service: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 4: Verify RDP Port is Listening
Write-Host "`n4️⃣ Verifying RDP port (3389) is listening..." -ForegroundColor Yellow
Start-Sleep -Seconds 2  # Give service time to start

$rdpPort = netstat -an | Select-String "3389.*LISTENING"
if ($rdpPort) {
    Write-Host "✅ RDP port 3389 is listening:" -ForegroundColor Green
    Write-Host "   $rdpPort" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  RDP port 3389 not detected. Service may need a restart." -ForegroundColor Yellow
    Write-Host "   Try restarting this laptop or running: Restart-Service TermService" -ForegroundColor Yellow
}

# Step 5: Get IP Address Information
Write-Host "`n5️⃣ Network Configuration:" -ForegroundColor Yellow
$networkAdapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.254.*" }

if ($networkAdapters) {
    Write-Host "✅ Available IP addresses for RDP connection:" -ForegroundColor Green
    foreach ($adapter in $networkAdapters) {
        $interface = Get-NetAdapter | Where-Object { $_.InterfaceIndex -eq $adapter.InterfaceIndex }
        Write-Host "   📍 $($adapter.IPAddress) ($($interface.Name))" -ForegroundColor Cyan
    }
} else {
    Write-Host "⚠️  No suitable IP addresses found" -ForegroundColor Yellow
}

# Step 6: Check Windows Edition
Write-Host "`n6️⃣ Windows Edition Check:" -ForegroundColor Yellow
$osInfo = Get-ComputerInfo | Select-Object WindowsProductName, WindowsEditionId
Write-Host "   OS: $($osInfo.WindowsProductName)" -ForegroundColor Cyan
Write-Host "   Edition: $($osInfo.WindowsEditionId)" -ForegroundColor Cyan

if ($osInfo.WindowsEditionId -like "*Pro*" -or $osInfo.WindowsEditionId -like "*Enterprise*" -or $osInfo.WindowsEditionId -like "*Education*") {
    Write-Host "✅ Windows edition supports Remote Desktop" -ForegroundColor Green
} else {
    Write-Host "⚠️  This Windows edition may not support Remote Desktop" -ForegroundColor Yellow
    Write-Host "   Remote Desktop requires Windows Pro, Enterprise, or Education" -ForegroundColor Yellow
}

# Step 7: Summary
Write-Host "`n===============================================" -ForegroundColor Cyan
Write-Host "🎉 Remote Desktop Setup Complete!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

Write-Host "`n📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Note the IP address(es) shown above" -ForegroundColor White
Write-Host "2. From your main laptop, open Remote Desktop Connection (mstsc)" -ForegroundColor White
Write-Host "3. Enter the IP address of this laptop" -ForegroundColor White
Write-Host "4. Use this laptop's Windows username and password" -ForegroundColor White

Write-Host "`n🔧 Troubleshooting:" -ForegroundColor Yellow
Write-Host "• If connection fails, ensure both laptops are on the same network" -ForegroundColor White
Write-Host "• Check that Windows Firewall allows Remote Desktop" -ForegroundColor White
Write-Host "• Verify the target laptop's user account has a password set" -ForegroundColor White
Write-Host "• Try pinging the target laptop from your main laptop first" -ForegroundColor White

Write-Host "`n✨ Script completed successfully!" -ForegroundColor Green