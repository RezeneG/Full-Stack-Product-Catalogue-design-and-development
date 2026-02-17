export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validateUsername = (username) => {
    return username.length >= 3 && username.length <= 30;
};

export const validateProduct = (product) => {
    const errors = {};
    
    if (!product.name?.trim()) {
        errors.name = 'Product name is required';
    } else if (product.name.length > 100) {
        errors.name = 'Product name must be less than 100 characters';
    }
    
    if (!product.description?.trim()) {
        errors.description = 'Description is required';
    } else if (product.description.length > 500) {
        errors.description = 'Description must be less than 500 characters';
    }
    
    if (!product.price) {
        errors.price = 'Price is required';
    } else if (isNaN(product.price) || product.price <= 0) {
        errors.price = 'Price must be a positive number';
    }
    
    if (!product.category) {
        errors.category = 'Category is required';
    }
    
    if (product.stock === undefined || product.stock === '') {
        errors.stock = 'Stock quantity is required';
    } else if (isNaN(product.stock) || product.stock < 0) {
        errors.stock = 'Stock must be a non-negative number';
    }
    
    return errors;
};

export const validateReview = (review) => {
    const errors = {};
    
    if (!review.rating || review.rating < 1 || review.rating > 5) {
        errors.rating = 'Rating must be between 1 and 5';
    }
    
    if (!review.title?.trim()) {
        errors.title = 'Review title is required';
    } else if (review.title.length > 100) {
        errors.title = 'Title must be less than 100 characters';
    }
    
    if (!review.comment?.trim()) {
        errors.comment = 'Review comment is required';
    } else if (review.comment.length > 500) {
        errors.comment = 'Comment must be less than 500 characters';
    }
    
    return errors;
};