
var q = new Date();
var m = q.getMonth();
var d = q.getDay();
var y = q.getYear();

var todaysDate = new Date(y,m,d).toString();

var taskModel = {
    init: function() {
        if (!localStorage.tasks) {
            localStorage.tasks = JSON.stringify([]);
        }
    },
    add: function(obj) {
        var data = JSON.parse(localStorage.tasks);
        data.push(obj);
        localStorage.tasks = JSON.stringify(data);
    },
    update:  function(content) {
      var data = JSON.parse(localStorage.tasks);
      data.forEach(function(task){
          if(content === task.content){
            task.completed = true;
          }
      })
      localStorage.tasks = JSON.stringify(data);
    },
    delete: function(content) {
      var data = JSON.parse(localStorage.tasks);
      data = data.filter(function(task){
        return content != task.content;
      })
      localStorage.tasks = JSON.stringify(data);
    },
    getAllTasks: function() {
        return JSON.parse(localStorage.tasks);
    }
};

var taskController = {
      addNewTask: function(taskStr) {
           taskModel.add({
               content: taskStr,
               date: todaysDate,
               completed: false
           });

           todaysTaskView.render();
       },

       completeTasks: function(content) {
         taskModel.update(content);
         todaysTaskView.render();
         finishedTaskView.render();
       },

       deleteTask: function(content){
         taskModel.delete(content);
         todaysTaskView.render();
         finishedTaskView.render();
       },

       getTasks: function() {
           return taskModel.getAllTasks();
       },

       init: function() {
           taskModel.init();
           todaysTaskView.init();
           finishedTaskView.init();
           taskHistoryView.init();
       }
}

var todaysTaskView = {
    init: function() {

        var formVal = document.getElementById('todaysTask');
        var taskForm = document.getElementById('taskForm');

        this.taskList = document.getElementById('todaysTaskList');
        taskForm.addEventListener('submit', function(){
          taskController.addNewTask(formVal.value);
        });
        this.render();
    },
    render: function(){
      var htmlStr = '';
      taskController.getTasks().forEach((task)=>{

        if(todaysDate === task.date && !task.completed){
          htmlStr += '<li class="task" data-content="'+task.content+'">'+
                       task.content +
                       '<span class="delete-icon">x</span>'+
                       '</li>';
        }

      });

      this.taskList.innerHTML = htmlStr;
      var ListItems = this.taskList.getElementsByTagName('li');

      for (i = 0; i < ListItems.length; i++) {

        ListItems[i].addEventListener('click', (function(j) {
            return function() {
              if(typeof ListItems[j] !== 'undefined'){
                    taskController.completeTasks(ListItems[j].getAttributeNode('data-content').value);
              }
            }
        })(i), false);

        ListItems[i].getElementsByTagName('span')[0].addEventListener('click', (function(k){
          return function(event) {
            event.stopPropagation();  
            taskController.deleteTask(ListItems[k].getAttributeNode('data-content').value);
          }
        })(i), false);

      }
    }
};

var finishedTaskView = {
    init: function() {
        this.finishedTaskList = document.getElementById('finishedTaskList');
        this.render();
    },
    render: function(){
      var htmlStr = '';
      taskController.getTasks().forEach((task)=>{
          if(todaysDate === task.date && task.completed){
            htmlStr += '<li class="task" data-content="'+task.content+'">'+
                         task.content +
                         '<span class="delete-icon">x</span>'+
                         '</li>';
          }
      });
     this.finishedTaskList.innerHTML = htmlStr;
     var ListItems = this.finishedTaskList.getElementsByTagName('li');
     for (i = 0; i < ListItems.length; i++) {
       ListItems[i].getElementsByTagName('span')[0].addEventListener('click', (function(k){
         return function() {
           taskController.deleteTask(ListItems[k].getAttributeNode('data-content').value);
         }
       })(i), false);
     }
    }
};

var taskHistoryView = {
    init: function() {
        this.finishedTaskList = document.getElementById('HistoryTaskList');
        this.render();
    },
    render: function(){
      var htmlStr = '';
      taskController.getTasks().forEach((task)=>{
          if(todaysDate !== task.date){
            htmlStr += '<li class="task" data-content="'+task.content+'">'+
                         task.content +
                         '</li>';
          }
      });
      this.finishedTaskList.innerHTML = htmlStr;
    }
};

taskController.init();
