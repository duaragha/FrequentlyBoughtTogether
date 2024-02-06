var selectors = document.querySelectorAll('#AddToCartFBTForm .product-variant-select');
selectors.forEach(function (selector) {
    selector.addEventListener('change', function () {
        var variant = selector.options[selector.selectedIndex];
        var product = selector.closest('.frequently-bought-together-product');
        var checkbox = product.querySelector('input[type="checkbox"]');
        var image = product.querySelector('.product-image');
        var price = product.querySelector('.product-price');
        var compareAtPrice = product.querySelector('.compare-at-price');
        checkbox.checked = true;
        checkbox.value = variant.value;
        image.src = variant.getAttribute('data-image');
        price.textContent = variant.getAttribute('data-price');
        if (compareAtPrice) {
            compareAtPrice.textContent = variant.getAttribute('data-compare-at-price');
        }
        calculateTotalPrice();
        updateAddToCartFBTButton();
    });
});
var checkboxes = document.querySelectorAll('#AddToCartFBTForm input[type=checkbox]');
checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
        var product = checkbox.closest('.frequently-bought-together-product');
        if (checkbox.checked) {
            product.classList.remove('disabled');
        } else {
            product.classList.add('disabled');
        }
        calculateTotalPrice();
        updateAddToCartFBTButton();
    });
});

function calculateTotalPrice() {
    var checkboxes = document.querySelectorAll('#AddToCartFBTForm input[type=checkbox]:checked');
    var totalPrice = 0;
    var totalCompareAtPrice = 0;


    checkboxes.forEach(function (checkbox) {
        var product = checkbox.closest('.frequently-bought-together-product');
        var price = product.querySelector('.product-price');
        var compareAtPrice = product.querySelector('.compare-at-price');
        var currentPrice = parseFloat(price.textContent.replace(/[^0-9.-]+/g, ""));
        var discount = checkbox.id === '{{ product.handle }}' ? 0 : 0.25; // 5% discount
        currentPrice *= (1 - discount);
        totalPrice += currentPrice;
        if (compareAtPrice && compareAtPrice.textContent !== "") {
            var currentCompareAtPrice = parseFloat(compareAtPrice.textContent.replace(/[^0-9.-]+/g, ""));
            if (currentCompareAtPrice > currentPrice) {
                totalCompareAtPrice += currentCompareAtPrice;
            } else {
                totalCompareAtPrice += currentPrice;
            }
        } else {
            totalCompareAtPrice += currentPrice;
        }

    });
    var totalElement = document.querySelector('.total-price');
    var totalCompareAtPriceElement = document.querySelector('.total-compare-at-price');
    if (totalPrice < totalCompareAtPrice) {
        totalCompareAtPriceElement.style.display = 'inline-block'; // Show the totalCompareAtPriceElement
    } else {
        totalCompareAtPriceElement.style.display = 'none'; // Hide the totalCompareAtPriceElement
    }
    var totalSavingsElement = document.querySelector('.total-savings');
    totalElement.textContent = '$' + totalPrice.toLocaleString('en-US');
    if (totalCompareAtPrice > 0) {
        totalCompareAtPriceElement.innerHTML = '$' + totalCompareAtPrice.toLocaleString('en-US');
        var totalSavings = totalCompareAtPrice - totalPrice;
        if (totalSavings > 0) {
            totalSavingsElement.textContent = 'You Saved: $' + totalSavings.toLocaleString('en-US');
        } else {
            totalSavingsElement.textContent = '';
        }
    } else {
        totalCompareAtPriceElement.textContent = '';
        totalSavingsElement.textContent = '';
    }
    updateAddToCartFBTButton();
}

function updateAddToCartFBTButton() {
    var AddToCartFBTButton = document.querySelector('#AddToCartFBT');
    var checkedCheckboxes = document.querySelectorAll('#AddToCartFBTForm input[type=checkbox]:checked');
    AddToCartFBTButton.disabled = checkedCheckboxes.length === 0;
    if (AddToCartFBTButton.disabled) {
        AddToCartFBTButton.classList.add('disabled');
    } else {
        AddToCartFBTButton.classList.remove('disabled');
    }
}
var AddToCartFBTForm = document.querySelector('#AddToCartFBTForm');

AddToCartFBTForm.addEventListener('submit', function (event) {
    var checkboxes = document.querySelectorAll('#AddToCartFBTForm input[type=checkbox]:checked');
    checkboxes.forEach(function (checkbox) {
        var product = checkbox.closest('.frequently-bought-together-product');
        var variantSelector = product.querySelector('.product-variant-select');
        if (variantSelector && variantSelector.value !== checkbox.value) {
            checkbox.value = variantSelector.value;
        }
    });
});

function getSelectedVariantIds() {
    var checkboxes = document.querySelectorAll('#AddToCartFBTForm input[type=checkbox]:checked');
    var variantIds = [];
    checkboxes.forEach(function (checkbox) {
        variantIds.push(checkbox.getAttribute('data-variant-id'));
    });
    return variantIds;
}

// Add an event listener to the "Add Selected to Cart" button
var addToCartButton = document.querySelector('#AddToCartFBT');
addToCartButton.addEventListener('click', function (event) {
    addToCartWithVariants();
});
calculateTotalPrice();