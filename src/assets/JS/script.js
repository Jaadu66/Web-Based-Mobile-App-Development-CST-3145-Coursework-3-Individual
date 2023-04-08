const app = new Vue({
  el: '#app',
  data() {
    return {
      page: 'products',
      cart: [],
      search: '',
      sortBy: 'subject',
      sortDirection: 'asc',
      products,
      checkout: [],
      order: {
        name: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        state: '',
        method: 'Home',
        gift: false,
      },
      states: {
        AUH: 'Abu Dhabi',
        AJM: 'Ajman',
        DXB: 'Dubai',
        FUJ: 'Fujairah',
        RAK: 'Ras Al Khaimah',
        SHJ: 'Sharjah',
        UMM: 'Umm Al Quwain',
      },
    };
  },

  methods: {
    addToCart(product) {
      this.$emit('addItemToCart', product);
      console.log(product.id);
      if (!this.cart.includes(product)) {
        this.cart.push(product);
        product.cartquantity++;
      } else {
        product.cartquantity++;
      }

      Swal.fire(
        'Cart Updated!',
        `You have added ${product.subject} to your cart!`,
        'success'
      );

      this.products.forEach((item) => {
        if (item.id === product.id) {
          item.space -= 1;
        }
      });
    },

    removeFromCart(product) {
      console.log(`Removed product ${product.id}`);
      if (product.cartquantity === 1) {
        this.cart.splice(this.cart.indexOf(product), 1);
        product.cartquantity = 0;
      } else {
        product.cartquantity--;
        console.log(`cartquantity: ${product.cartquantity}`);
      }

      Swal.fire(
        'Removed from Cart!',
        `${product.subject} has been removed from your cart!`,
        'warning'
      );

      this.products.forEach((item) => {
        if (item.id === product.id) {
          item.space += 1;
        }
      });
    },

    navigateTo(page) {
      this.page = page;
      console.log(this.page);
    },

    spaceCount(product) {
      return product.space > 0;
    },

    onSubmitCheckout() {
      const isFormComplete = Object.values(this.order).every((value) => value.trim() !== '');
      if (isFormComplete) {
        this.checkout.push(this.order);
        this.order = {
          name: '',
          email: '',
          address: '',
          city: '',
          zip: '',
          state: '',
          method: 'Home',
          gift: false,
        };
        Swal.fire(
          'Order Placed!',
          'Your order has been placed!',
          'success'
        );
        this.cart = [];
        this.navigateTo('products');
      } else {
        Swal.fire(
          'Form Not Complete!',
          'Please fill all the fields!',
          'error'
        );
        this.page = 'checkout';
      }
    },

    checkoutCart() {
      if (this.cart.length > 0) {
        this.page = 'checkout';
      } else {
        Swal.fire(
          'Cart is Empty!',
          'Please select a lesson',
          'warning'
        );
      }
    },
  },

  computed: {
    filteredProducts() {
      if (this.search) {
        return this.products.filter((product) => {
          return product.subject.toLowerCase().includes(this.search.toLowerCase()) || product.location.toLowerCase().includes(this.search.toLowerCase());
        });
      } else if (this.sortBy === 'subject') {
        return this.products.slice().sort((a, b) => {
          return this.sortDirection === 'asc'
          ? a.subject.localeCompare(b.subject)
          : b.subject.localeCompare(a.subject);
      });
    } else if (this.sortBy === 'price') {
      return this.products.slice().sort((a, b) => {
        return this.sortDirection === 'asc' ? a.price - b.price : b.price - a.price;
      });
    } else if (this.sortBy === 'space') {
      return this.products.slice().sort((a, b) => {
        return this.sortDirection === 'asc' ? a.space - b.space : b.space - a.space;
      });
    } else {
      return this.products;
    }
  },
  
  cartTotal() {
    return this.cart.reduce((total, item) => {
      return total + item.price * item.cartquantity;
    }, 0);
  },
  
  cartCount() {
    return this.cart.reduce((count, item) => {
      return count + item.cartquantity;
    }, 0);
  },
  }
});