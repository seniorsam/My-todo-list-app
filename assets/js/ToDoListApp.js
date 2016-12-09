(function($, document, window ,undefined){
	
	var ToDo = {
		
		/*
		* Init function: simply to grab all the logic in one place
		*/
		
		init:
			function( elem ){
				var self = this,
					$elem = $( elem ),
					// main static components
					components = {
						mainWrapper: $elem,
						submitTaskBtn: $elem.find('.submit-task'),
						taskField: $elem.find('.task-field'),
						listWrapper: $elem.find('.todolist'),
						totalCounter: $elem.find("#total-tasks")
					};
				self.recoverSavedLists( components );
				self.AddTask( components );
			},
		
		/*
		* AddTask function: when the user press add task this function create the html structure for the task and append * it to the main wrapper with the user inserted data :D
		*/
		
		AddTask:
			function( components ){
				
				var self = this,
					regex = /^[a-z][a-z0-9 ]+$/i;
					  
				components.submitTaskBtn.on('click', function(){
					if (regex.test( components.taskField.val() ) !== false){
					$("<li class='task-item'></li>")
					
						//check box controller
						.append("<input class='checkbox' type='checkbox' data-func='HighLight' title='Done yet'/>")
					
						//close handler
						.append("<div class='handler handle-close' title='Delete' data-func='DeleteTask'></div>")
						
						//content
						.append("<p>" + components.taskField.val() + "</p>")
						
						//time
						.append("<p class='time'>" + self.SetDate() + "</p>")
						
						//bound events
						.on('click','.checkbox, .handler',function(){  
							// call the function
							self[($(this).data('func'))]($(this), components);
							// save the changes
							self.saveList( components );
						})
					.appendTo( components.listWrapper );	
					// increment counter by 1
					var total = total = components.totalCounter.text();	
					components.totalCounter.text( ++total );
					// clear the input value
					components.taskField.val("");	
					// save the changes
					self.saveList( components );
					} else {
						self.ShowAlert(components.mainWrapper ,"Error: invalid input entry");	
					}

				});
			},
		
		/*
		* recoverSavedLists function: to recover the saved tasks and append it to the list
		*/
		
		recoverSavedLists:
			function( components ){
				var self = this, 
					savedTasksCount = localStorage.getItem("Todol tasks count");
				components.listWrapper.html(localStorage.getItem("Todol saved tasks"));
				(savedTasksCount !== null)  ? components.totalCounter.text(savedTasksCount) : 0;
				components.listWrapper.on('click','.checkbox, .handler',function(){  
							// call the function from a string from custom attribute func
							self[($(this).data('func'))]($(this), components);
							// save the changes
							self.saveList( components );
				})
			},
		
		/*
		* saveList function: save the tasks list in the memory
		*/
		
		saveList:
			function( components ){
				var self = this;
				
				localStorage.setItem("Todol saved tasks", $( components.listWrapper ).html());
				localStorage.setItem("Todol tasks count", components.totalCounter.text());
				self.ShowAlert(components.mainWrapper, "Changes saved successfully");
				
			},
		
		/*
		* HighLight function: mark the ended task with green
		*/
		
		HighLight:
			function(current, components){
				var self = this,
				listelem = current.closest("li"),
				handler  = current.siblings(".handler");
				
				if(current.is(':checked')){
					current.attr("checked", true);
					listelem.css("backgroundColor","#88ff4d");
					handler.removeClass("handle-close").addClass("handle-ok");
				} else {
					current.removeAttr("checked");
					listelem.css("backgroundColor","#fff");			
					handler.removeClass("handle-ok").addClass("handle-close");
				}
			},
		
		/*
		* DeleteTask function: to delete task from the list
		*/
		
		DeleteTask:
			function( current, components ){
				var self = this;
					listelem = current.closest("li")
					total = components.totalCounter.text();
				listelem.remove();
				components.totalCounter.text( --total );
			},
		
		/*
		* ShowAlert function: show alerts to users
		*/
		
		ShowAlert:
			function (wrapper, message){
				var alert = wrapper.find('.alert-message').text(message);
				alert.slideDown(200);
				setTimeout(function(){
					alert.slideUp(200);
				},2500);
			},

		/*
		* SetDate function: set the current date using Date object
		*/
		
		SetDate:
			function(){
				var date  = new Date(),
					dateString = date.toDateString();
				
				return "Created at: " + dateString;
				
			}

	};
	
	$.fn.ToDoApp = function(){
		this.each(function(){
			ToDo.init( this );
		});
	}
	
}(jQuery ,document ,window))