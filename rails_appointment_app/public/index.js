Vue.component('app-home', {
  template: '#grid-template',
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  },
  data: function() {
    var sortOrders = {}
    this.columns.forEach(function(key) {
      sortOrders[key] = 1;
    });
    return {
      sortKey: '',
      sortOrders: sortOrders
    };
  },
  created: function() {
    // this.getAppointments();
  },
  computed: {
    filteredData: function() {
      var sortKey = this.sortKey;
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1;
      var data = this.data;
      if (filterKey) {
        data = data.filter(function(row) {
          return Object.keys(row).some(function(key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function(a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        });
      }
      return data;
    }
  },
  filters: {
    capitalize: function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * - 1;
    }
  }
});

Vue.component('signup-page', {
  template: '#signup-page',
  data: function() {
    return {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };
      axios
        .post("/users", params)
        .then(function(response) {
          router.push("/login");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
});

Vue.component('login-page', {
  template: '#login-page',
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        auth: { email: this.email, password: this.password }
      };
      axios
        .post("/user_token", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    }
  }
});

Vue.component('logout-page', {
  template: '#app-home',
  created: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/");
  }
});

var router = new VueRouter({
  routes: [
    { path: "/", component: Vue.component('app-home') },

    { path: "/signup", component: Vue.component('signup-page') },
    { path: "/login", component: Vue.component('login-page') },
    { path: "/logout", component: Vue.component('logout-page') }
  ],
});

var app = new Vue({
  el: '#app',
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    console.log(jwt);
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  },
  data: {
  // data: function() {
    // return {
    searchQuery: '',
    gridColumns: [ 
      // 'id', 
      'name', 
      'kind', 
      'description', 
      'start_time', 
      'end_time', 
      'room_id', 
      'user_id', 
      // 'url', 
      // 'created_at', 
      // 'updated_at'
    ],
    gridData: [],
    loading: true,

    // };
  },
  mounted () {
    axios
      .get('/appointments.json')
      .then(response => {
        this.gridData = response.data;
      })
      .catch(error => {
        console.log(error)
        // this.errored = true
      })
      .finally(() => this.loading = false);
  },
  // methods: {
  //   getAppointments: function() {
  //     // console.log(this.gridData = [{name:'hey'}]);
  //     axios
  //       .get("/appointments.json")
  //       .then(function(response) {
  //         console.log(response.data);
  //         console.log(this.gridData);

  //         return this.gridData = response.data;

  //         // response.data.forEach(function(key) {
  //         //   this.gridData.push(key);
  //         // });

  //         // this.gridData = [
  //         //   { name: 'Chuck Norris', power: Infinity },
  //         //   { name: 'Bruce Lee', power: 9000 },
  //         //   { name: 'Jackie Chan', power: 7000 },
  //         //   { name: 'Jet Li', power: 8000 }
  //         // ];

  //       })
  //       .catch(
  //         function(error) {
  //           // this.errors = ["Invalid email or password."];
  //           // this.email = "";
  //           // this.password = "";
  //           console.log('error yarayara',error);
  //         }
  //       );
  //   },
  // },
});
