# Update favicon and logo files
$source = "c:\Users\Deviare User\CascadeProjects\car-sourcing-app\frontend\public\Thirdeye Logo Design.png"
$dest192 = "c:\Users\Deviare User\CascadeProjects\car-sourcing-app\frontend\public\logo192.png"
$dest512 = "c:\Users\Deviare User\CascadeProjects\car-sourcing-app\frontend\public\logo512.png"

# Copy the logo file to replace the default ones
Copy-Item -Path $source -Destination $dest192 -Force
Copy-Item -Path $source -Destination $dest512 -Force

Write-Host "Logo files have been updated successfully!"
