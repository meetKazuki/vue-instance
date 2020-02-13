Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
    <div class="product">
    <div class="product-image">
      <img :src="image" alt="">
    </div>

    <div class="product-info">
      <h1 :show="onSale">{{ title }}</h1>
      <p v-if="inStock">In Stock</p>
      <p v-else :class="{ activeTab: !inStock }">Out of Stock</p>
      <p>Shipping: {{ shipping }}</p>

      <ul>
        <li v-for="detail in details">{{ detail }}</li>
      </ul>

      <div v-for="(variant, index) in variants"
        :key="variant.variantId"
        class="color-box"
        :style="{ backgroundColor: variant.variantColor }"
        @mouseover="updateProduct(index)">
      </div>

      <button @click="addToCart"
        :disabled="!inStock"
        :class="{ disabledButton: !inStock }">
        Add to Cart
      </button>
    </div>

    <product-tabs></product-tabs>

    <div>
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <ul>
        <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>{{ review.rating }}</p>
          <p>{{ review.review }}</p>
        </li>
      </ul>
    </div>

    <product-review @review-submitted="addReview"></product-review>
  </div>
  `,
  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      selectedVariant: 0,
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      variants: [
        {
          variantId: 2234,
          variantColor: 'green',
          variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
          variantQuantity: 10,
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
          variantQuantity: 0,
        },
      ],
      reviews: [],
      inventory: 100,
      description: 'Tote bag tumblr shoreditch bespoke activated charcoal iceland',
      link: 'https://www.vuemastery.com/',
      onSale: true,
      sizes: [23, 45, 89.9],
    };
  },
  methods: {
    addToCart: function() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    updateProduct: function(index) {
      this.selectedVariant = index;
      console.log(index);
    },
    addReview: function(productReview) {
      this.reviews.push(productReview);
    },
    removeFromCart: function() {
      this.cart > 0 ? (this.cart -= 1) : this.cart;
    },
  },
  computed: {
    title: function() {
      return this.brand + ' ' + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      return this.premium ? 'Free' : 2.99;
    },
  },
});

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <strong>Please correct the following error(s):</strong>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name">
      </p>

      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
        <input type="submit" value="Submit">
      </p>
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
    };
  },
  methods: {
    onSubmit: function() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
        };
        this.$emit('review-submitted', productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
      } else {
        if(!this.name) this.errors.push('Name required');
        if(!this.review) this.errors.push('Review required');
        if(!this.rating) this.errors.push('Ratings required');
      }
    },
  },
});

Vue.component('product-tabs', {
  template: `
    <div>
      <span class="tab"
        :class="{ activeTab: selectedTab === tab }"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="selectedTab = tab"
      >
        {{ tab }}
      </span>
    </div>
  `,
  data: function() {
    return {
      tabs: ['Reviews', 'Make a Review'],
      selectedTab: 'Reviews',
    }
  }
});

var app = new Vue({
  el: '#app',
  data: {
    cart: [],
    premium: true,
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
  },
});
