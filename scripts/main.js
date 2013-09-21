(function ($, BB, _) {

	$('#add_contact').tooltip();

	var App = Backbone.View.extend({
		el: "#contacts",
		events: {
			'click #add_contact': 'addPerson'
		},
		initialize: function () {
			this.input_name = $('#inputs input[name=fullname]');
			this.input_number = $('#inputs input[name=number]');
			this.input_username = $('#inputs input[name=username]');
			this.contacts_list = $('.table tbody');
			
			this.listenTo(this.collection, 'add', this.createView)
			this.collection.fetch();
		},
		addPerson: function (evt) {

			var person = new PersonModel({
				name: this.input_name.val(),
				number: this.input_number.val(),
				username: this.input_username.val()
			});

			this.collection.add(person);
			person.set("num", this.collection.length);

			var view = new PersonView({model: person});
			this.contacts_list.append(view.render().el);
		}
	});

	
	$('#edit_contact').tooltip();

	var App = Backbone.View.extend({
		el: "#contacts",
		events: {
			'submit form': 'submit',
			'click button.delete' : 'deleteContact',			
			'click button.cancel': 'cancel'
		},

		initialize: function () {
			this.input_name = $('#inputs input[name=fullname]');
			this.input_number = $('#inputs input[name=number]');
			this.input_username = $('#inputs input[name=username]');
			this.contacts_list = $('.table tbody');
		},
		
		submit: function (evt) {

			var person = new PersonModel({
				name: this.input_name.val(),
				number: this.input_number.val(),
				username: this.input_username.val()
			});
			
			this.collection.update(person);
			this.remove();
			$("#edit_contact").hide();
			$("#add_contact").show();
		},	
		
		deleteContact: function(evt) {
			if (this.model) {
				this.model.destroy({
					statusCode: {
						200: function(data) {
							router.navigate('', {trigger:true});
						},
						404: function(data) {
							console.log('An error occurred and could not delete the contact.');
						}
					}
				});
			}
			
			return false;
		},		

		cancel: function() {
			this.remove();
			$("#edit_contact").hide();
			$("#add_contact").show();		
		},
	
	});



	
	
	var PersonModel = Backbone.Model.extend({
		defaults: {
			'name': '-',
			'number': '-',
			'username': '-'
		},
		initialize: function () {

		}
	});

	var PersonCollection = Backbone.Collection.extend({
		model: PersonModel,
		url: '/contacts',
		initialize: function () {
			contacts = new PersonCollection.Contacts
			contacts.fetch();
		}
		
		validate: function(attrs) {
			
			if (!attrs.number) == true) {
				return 'Please enter a valid number';
			}
		}
		idAttribute: "_id",
		urlRoot: "/contacts",
		defaults: {
			_id: null
		}
	});

	var PersonView = Backbone.View.extend({
		tagName: 'tr',
		template: $('#contact_template').html(),
		initialize: function() {

		},
		render: function() {
			var compiledTemplate = _.template(this.template);
			this.$el.html(compiledTemplate(this.model.toJSON()))
			return this;
		}
	});

	var contactApp = new App({collection: new PersonCollection()});



})(jQuery, Backbone, _)