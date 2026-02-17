Write-Host "🔍 VERIFYING PRODUCT CATALOGUE PROJECT" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

$TOTAL_FILES = 0
$MISSING_FILES = 0
$MISSING_LIST = @()

Function Check-File {
    param($Path, $Description)
    
    if (Test-Path $Path) {
        Write-Host "✅ $Path" -ForegroundColor Green
        $script:TOTAL_FILES++
    } else {
        Write-Host "❌ MISSING: $Path" -ForegroundColor Red
        $script:MISSING_FILES++
        $script:MISSING_LIST += $Path
    }
}

Write-Host "📁 CHECKING BACKEND FILES..." -ForegroundColor Yellow
Check-File "server/models/Product.js" "Product schema"
Check-File "server/models/User.js" "User schema"
Check-File "server/models/Review.js" "Review schema"
Check-File "server/models/Order.js" "Order schema"
Check-File "server/routes/products.js" "Product routes"
Check-File "server/routes/auth.js" "Auth routes"
Check-File "server/routes/reviews.js" "Review routes"
Check-File "server/routes/payments.js" "Payment routes"
Check-File "server/middleware/auth.js" "Auth middleware"
Check-File "server/server.js" "Main server"
Check-File "server/seed.js" "Product seed"
Check-File "server/seedUsers.js" "User seed"
Check-File "server/package.json" "Backend dependencies"
Check-File "server/.env.example" "Environment template"
Check-File "server/.gitignore" "Git ignore"

Write-Host ""
Write-Host "📁 CHECKING COMPONENTS..." -ForegroundColor Yellow
Check-File "client/src/components/AuthModal.js" "Auth modal"
Check-File "client/src/components/AuthModal.css" "Auth styles"
Check-File "client/src/components/UserMenu.js" "User menu"
Check-File "client/src/components/UserMenu.css" "Menu styles"
Check-File "client/src/components/CartIcon.js" "Cart icon"
Check-File "client/src/components/CartIcon.css" "Cart styles"
Check-File "client/src/components/StripePayment.js" "Stripe payment"
Check-File "client/src/components/StripePayment.css" "Payment styles"
Check-File "client/src/components/RatingStars.js" "Rating stars"
Check-File "client/src/components/RatingStars.css" "Rating styles"
Check-File "client/src/components/LoadingSpinner.js" "Loading spinner"
Check-File "client/src/components/LoadingSpinner.css" "Spinner styles"
Check-File "client/src/components/ProductCard.js" "Product card"
Check-File "client/src/components/ProductCard.css" "Card styles"

Write-Host ""
Write-Host "📁 CHECKING PAGES..." -ForegroundColor Yellow
Check-File "client/src/pages/HomePage.js" "Home page"
Check-File "client/src/pages/HomePage.css" "Home styles"
Check-File "client/src/pages/AddProductPage.js" "Add product"
Check-File "client/src/pages/AddProductPage.css" "Add styles"
Check-File "client/src/pages/ViewProductsPage.js" "View products"
Check-File "client/src/pages/ViewProductsPage.css" "View styles"
Check-File "client/src/pages/CheckoutPage.js" "Checkout"
Check-File "client/src/pages/CheckoutPage.css" "Checkout styles"
Check-File "client/src/pages/OrdersPage.js" "Orders"
Check-File "client/src/pages/OrdersPage.css" "Orders styles"
Check-File "client/src/pages/OrderDetailsPage.js" "Order details"
Check-File "client/src/pages/OrderDetailsPage.css" "Details styles"

Write-Host ""
Write-Host "📁 CHECKING SERVICES & CORE..." -ForegroundColor Yellow
Check-File "client/src/services/api.js" "API service"
Check-File "client/src/services/auth.js" "Auth service"
Check-File "client/src/services/payment.js" "Payment service"
Check-File "client/src/context/CartContext.js" "Cart context"
Check-File "client/src/utils/formatters.js" "Formatters"
Check-File "client/src/utils/validators.js" "Validators"
Check-File "client/src/App.js" "App component"
Check-File "client/src/App.css" "App styles"
Check-File "client/src/index.js" "Entry point"
Check-File "client/src/index.css" "Global styles"

Write-Host ""
Write-Host "📁 CHECKING PUBLIC FOLDER..." -ForegroundColor Yellow
Check-File "client/public/index.html" "HTML file"
Check-File "client/public/manifest.json" "Manifest"
Check-File "client/public/site.webmanifest" "Site manifest"
Check-File "client/public/robots.txt" "Robots"
Check-File "client/public/favicon.ico" "Favicon"
Check-File "client/public/logo192.png" "Logo 192"
Check-File "client/public/logo512.png" "Logo 512"
Check-File "client/public/og-image.png" "OG image"

Write-Host ""
Write-Host "📁 CHECKING ROOT FILES..." -ForegroundColor Yellow
Check-File "README.md" "Documentation"
Check-File "setup.sh" "Mac/Linux setup"
Check-File "setup.bat" "Windows setup"
Check-File "postman_collection.json" "Postman collection"
Check-File ".gitignore" "Git ignore"
Check-File ".codesandboxignore" "CodeSandbox ignore"
Check-File "sandbox.config.json" "Sandbox config"
Check-File "deploy-sandbox.sh" "Deploy script"

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "📊 SUMMARY:" -ForegroundColor White
Write-Host "   ✅ Total files found: $TOTAL_FILES" -ForegroundColor Green
Write-Host "   ❌ Missing files: $MISSING_FILES" -ForegroundColor $(if($MISSING_FILES -eq 0){"Green"}else{"Red"})
Write-Host "   🎯 Expected total: 72" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

if ($MISSING_FILES -eq 0) {
    Write-Host ""
    Write-Host "🎉 PERFECT! All 72 files are present!" -ForegroundColor Green
    Write-Host "🚀 Your project is COMPLETE and READY for deployment!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Missing $MISSING_FILES files:" -ForegroundColor Red
    foreach ($file in $MISSING_LIST) {
        Write-Host "   • $file" -ForegroundColor Yellow
    }
}
