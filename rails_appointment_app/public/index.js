(function() {
  this.App || (this.App = {});

  App.cable = ActionCable.createConsumer();

}).call(this);

// var cable = ActionCable.createConsumer('ws://localhost:3000/cable');

var Home = Vue.component('home',{ 
  template: '#home',
  data: function() {
    return {
      searchQuery: '',
      gridColumns: [ 
        // 'id', 
        'name', 
        'kind', 
        'description', 
        // 'start_time',
        'start_time_friendly',
        // 'end_time',
        'end_time_friendly',
        'room_id', 
        'user_id', 
        // 'url', 
        // 'created_at', 
        // 'updated_at'
      ],
      gridData: [],
      loading: true,
    };
  },
  methods: {},
  mounted() {
    // this.$socket.emit('pingServer', 'PING!'); 
    axios
      .get('/appointments.json')
      .then(response => {
        this.gridData = response.data;
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => this.loading = false);

    App.room = App.cable.subscriptions.create("AppointmentChannel", {
      connected: function() {
        // Called when the subscription is ready for use on the server
        console.log('connected');
      },
      
      disconnected: function() {
        // Called when the subscription has been terminated by the server
      },
      
      received: function(appointment) {
        // Called when there's incoming data on the websocket for this channel
        console.log('received',appointment);
        this.gridData.push(appointment);
        
      }.bind(this),
      
      speak: function(message) {
        console.log('speak');
      },
    });
  }, 
});

var Appointments = Vue.component('appointments', {
  template: '#appointments',
  props: {
    data: Array,
    columns: Array,
    filterKey: String
  },
  data: function() {
    var sortOrders = {};
    this.columns.forEach(function(key) {
      sortOrders[key] = 1;
    });
    return {
      sortKey: '',
      sortOrders: sortOrders
    };
  },
  created: function() {},
  computed: {
    filteredData: function() {
      var sortKey = this.sortKey;
      var filterKey = this.filterKey && this.filterKey.toLowerCase();
      var order = this.sortOrders[sortKey] || 1;
      var data = this.data;
      if (filterKey) {
        data = data.filter(function(row) {
          return Object.keys(row).some(function(key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
          });
        });
      }
      if (sortKey) {
        data = data.slice().sort(function(a, b) {
          a = a[sortKey];
          b = b[sortKey];
          return (a === b ? 0 : a > b ? 1 : -1) * order;
        });
      }
      return data;
    }
  },
  filters: {
    capitalize: function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  },
  methods: {
    sortBy: function(key) {
      this.sortKey = key;
      this.sortOrders[key] = this.sortOrders[key] * - 1;
    }
  }
});

var Events = Vue.component('events', {
  template: '#events',
  data: function() {
    return { 
      events: []
    }
  },
  created: function() {
    axios.get('/api/eventbrites').then(response => {
      console.log(this)
      console.log(response);
      this.events = response.data;
    })
  },
  computed: {},
  filters: {},
  methods: {
    formatDate(date) {
      return moment(date).format('dddd, MMMM Do YYYY, h:mm:ss a');
    }
  }
});

var Breaks = Vue.component('breaks', {
  template: '#breaks',
  props: { data: Array, },
  // data: function() {},
  created: function() {
  },
  computed: {},
  filters: {},
  methods: {
    isBreak: function(appointment) {
      console.log(appointment);
      return appointment.kind === 3;
    },
  }
});

var TwoPeopleMeeting = Vue.component('two-people-meeting', {
  template: '#two-people-meeting',
  props: { data: Array, },
  // data: function() {},
  created: function() {
  },
  computed: {},
  filters: {},
  methods: {
    isSmallMeeting: function(appointment) {
      console.log(appointment);
      return appointment.kind === 2;
    },
  }
});

var Signup = Vue.component('signup', {
  template: '#signup',
  data: function() {
    return {
      name: "test",
      email: "",
      password: "",
      passwordConfirmation: "",
      kind: 1, 
      availability: true,
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation,
        kind: this.kind, 
        availability: this.availability,
      };

      console.log(params);

      axios
        .post("/users.json", params)
        .then(function(response) {
          console.log(response.data);
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

var Login = Vue.component('login', {
  template: '#login',
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
          console.log(localStorage.getItem("jwt"));
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

var Logout = Vue.component('logout', {
  template: '#appointments',
  created: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/");
    console.log('token removed');
    console.log(localStorage.getItem("jwt"));
  }
});

var router = new VueRouter({
  routes: [
    { path: "/", component: Home },
    { path: "/home", component: Home },
    { path: "/signup", component: Signup },
    { path: "/login", component: Login },
    { path: "/logout", component: Logout }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: '#app',
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    console.log('Current jwt',jwt);
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  },
});
