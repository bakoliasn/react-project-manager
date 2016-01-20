var React = require('react');
var ReactDOM = require('react-dom');
var request = require('superagent');
import { Router, Route, IndexRoute, RouteHandler, Link } from 'react-router';
import { createHistory } from 'history';

var EventEmitter = require('events');
var hub = new EventEmitter();

function addTotalUsed (array) {
  let total = 0;
  array.forEach(function(item){
    total += item.amount;
  })
    return total;
};

function time (){ return new Date().getTime() }

var App = React.createClass({
  getInitialState() {
    return {
      tasks:[],
      todo:[],
      hours:[],
      NetExpense: [],
      externalDocs: [],
      notes:[],
      projects: []
    }
  },
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
});
var Login = React.createClass({
  giveData (event) {
    const that = this;
    event.preventDefault();
    request
    .post('http://127.0.0.1:3001/Login')
    .set('Accept', 'application/json')
    .send({ email: that.refs.email.value, password: that.refs.password.value })
    .end(function(err, res) {
      if (err || !res.ok) {
        console.log(err);
      } else {
        localStorage.setItem("token", res.text);
        that.props.history.pushState(null, '/projects');
      }
    });
  },
  render(){
    return (
      <div className="loginpage">
          <h1 style={{textAlign: 'center', fontFamily: 'Kanit', position: 'absolute', width: '100%', top: 100, fontSize: 48}}>PRJCTMNGMT</h1>
          <div className="loginform">
            <input type="text" style={{width: '80%', padding: 10, fontFamily: 'Kanit', marginLeft: '10%', marginRight: '10%', marginTop: '7%', borderRadius: 4, border: 'none', outline: 'none'}} placeholder="Email" ref='email' />
            <input type="password" style={{width: '80%', padding: 10, fontFamily: 'Kanit', marginLeft: '10%', marginRight: '10%', marginTop: '7%', borderRadius: 4, border: 'none', outline: 'none'}} placeholder="Password" ref='password'/>
            <input onClick={this.giveData} type="button" className="btn btn-success" style={{width: '80%', padding: 10, fontFamily: 'Kanit', marginLeft: '10%', marginTop: '7%', borderRadius: 4, border: 'none', outline: 'none'}} defaultValue="Login" />
            <input onClick={() => this.props.history.pushState(null, '/signup')} type="button" className="btn btn-success" style={{color: 'blue', width: '80%', padding: 10, fontFamily: 'Kanit', marginLeft: '10%', marginTop: '7%', borderRadius: 4, border: 'none', outline: 'none'}} defaultValue="Signup" />

            </div>
        </div>
    )
  }
});

var Signup = React.createClass({
  giveData (event) {
    const that = this;
    event.preventDefault();
    request
    .post('http://127.0.0.1:3001/Signup')
    .set('Accept', 'application/json')
    .send({ email: that.refs.email.value, password: that.refs.password.value })
    .end(function(err, res) {
      if (err || !res.ok) {
        console.log(err);
      } else {
        localStorage.setItem("token", res.text);
        that.props.history.pushState(null, '/projects');
      }
    });
  },
  render(){
    return (
      <div className="loginpage">
          <h1 style={{textAlign: 'center', fontFamily: 'Kanit', position: 'absolute', width: '100%', top: 100, fontSize: 48}}>PRJCTMNGMT</h1>
          <div className="loginform">
            <input type="text" style={{width: '80%', padding: 10, fontFamily: 'Kanit', marginLeft: '10%', marginRight: '10%', marginTop: '7%', borderRadius: 4, border: 'none', outline: 'none'}} placeholder="Email" ref='SignupEmail' />
            <input type="password" style={{width: '80%', padding: 10, fontFamily: 'Kanit', marginLeft: '10%', marginRight: '10%', marginTop: '7%', borderRadius: 4, border: 'none', outline: 'none'}} placeholder="Password" ref='signupPassword'/>
            <input onClick={this.giveData} type="button" className="btn btn-success" style={{ color: 'blue', width: '80%', padding: 10, fontFamily: 'Kanit', marginLeft: '10%', marginTop: '7%', borderRadius: 4, border: 'none', outline: 'none'}} defaultValue="Signup" />
          </div>
        </div>
    )
  }
});

var HeaderMenu = React.createClass({
  getInitialState() {
    return{
      projects:[]
    }
  },
  componentWillMount() {
    this.fetchData();
  },
  fetchData(){
    let that = this;
    this.setState({
      loading: true
    });
    request.get("http://127.0.0.1:3001/Projects")
    .set('authorization', localStorage.getItem("token"))
    .end(function(err, res) {
      that.setState({
        loading: false
      });
      if (err)
      that.setState({
        error: err
      })
      else {
        let data = JSON.parse(res.text)
        that.setState({projects : data});
      }
    })
  },
  render : function() {
    let that = this;
    return (
      <div>
        <header>
          <div className="logo">
            <p className="headertext">PRJCTMNGMT</p>
          </div>
          <div className="nav">
            <ul>
              <li>
                <a href="#">
                  New Project
                </a>
              </li>
            </ul>
          </div>
        </header>
        <div className="indexmenu">
          <p className="username">
            {this.props.username}
          </p>
          <p className="totalprojects">
            {this.state.projects.length} Projects
          </p>
        </div>
        <section className='main'>
          <div className="project">
            <div className="projectDetails">
              <p className="projectName">
                New Project
              </p>
              <input onClick={this.openOverlay}
                type="button"
                className="btn-primary projectView"
                defaultValue="New Project" />
            </div>
          </div>
          {this.renderProject()}
          {this.state.addingProject ? this.renderProjectOverlay() : null}
        </section>
      </div>
    )
  },
  renderProjectOverlay() {
    return (
      <div className="overlay">
         <div className="editform">
        <form>
        <input style={{color: 'black'}} type="text" placeholder="Project name..." className="topinput" ref='projectName'></input>
       <textarea style={{color: 'black'}} type="text" placeholder="Project description..." className="projectsubinput" ref='projectDescription'></textarea>
       <input style={{color: 'black'}} type="text" placeholder="Project budget..." className="subinputProject" ref='projectBudget'></input>
        <input type="button" value="Submit New Project" className="btn-primary submitExpense" onClick={this.postNewProject}></input>
        </form>
      <a href="#"><span className="Xoff" onClick={this.closeOverlay}>X</span></a></div>
      </div>
    )
  },
  openOverlay() {
      this.setState({
        addingProject: true
      });
    },
    closeOverlay() {
      this.setState({
        addingProject: false
      });
},
postNewProject() {
  var that = this;
  request
  .post('http://127.0.0.1:3001/Projects')
  .set('authorization', localStorage.getItem("token"))
  .send({ name: this.refs.projectName.value, description: this.refs.projectDescription.value, budget: this.refs.projectBudget.value})
  .end(function(err, res) {
    if (err || !res.ok) {
      console.log(err);
    }
    that.fetchData();
  });
  that.closeOverlay();

},
  renderProject() {
    if (this.state.error) {
      return 'An error occurred: ' + JSON.stringify(this.state.error);
    }
    else if (this.state.loading || !this.state.projects) {
        return 'loading...';
    }
    else {
      return (
        <span>
          {this.state.projects.map(
            function(item){
              return <Project
                key={Math.random() * time()}
                projectname={item.name}
                id={item.id}
                projectBudget={item.budget}
                projectDescription={item.description}
                />})}
              </span>
            );
          }
    }
      });

      var Project = React.createClass({
        render: function () {
          return (
            <div className="project">
              <div className="projectDetails">
                <p className="projectName">
                  {this.props.projectname}
                </p>
                <Link to={`/Projects/${this.props.id}`} >
                <input
                  type="button"
                  className="btn-success projectView"
                  defaultValue="View" />
                </Link>
              </div>
            </div>
          )
        }
      });

var UnfinishedTasks = React.createClass({
  getInitialState : function () {
    return {
      use: this.props.crocodile,
      tasks: []
    };
  },
  componentWillReceiveProps : function(nextProps) {
    if (this.props.crocodile !== nextProps.crocodile) {
      this.fetchData(nextProps.crocodile);
        }
  },
  componentWillMount: function () {
    this.fetchData(this.props.crocodile)
  },
  componentDidMount() {
    hub.on('refresh_data', this.fetchData);
  },
  fetchData: function(id) {
    id = id || this.props.crocodile;
    if (!id) {
      return;
    }
    let that = this;
    that.setState({
      loading: true
    });
    request.get('http://127.0.0.1:3001/Projects/' + id + '/Tasks')
    .set('authorization', localStorage.getItem("token"))
    .end(function(err, res) {
      that.setState({
        loading: false
      });
      if (err)
      that.setState({
        error: err
      });
      else {
        let data = JSON.parse(res.text)
        that.setState({tasks : data});
      }
    });
  },
  setToFinished(id){
    let that = this;
    request.put('http://127.0.0.1:3001/Projects/Tasks/' + id)
    .set('authorization', localStorage.getItem("token"))
    .send({completed: 1})
    .end(function(err, res) {
      if(err){console.log(err)}
      hub.emit('refresh_data');
    });
  },
  render() {
    let that = this;
    if (this.state.loading) {
      return (<a className="colornav" href="#"><p className="unfinishedlinks">Loading...</p></a>)
    } else if (!this.state.tasks.length){
      return (<a className="colornav" href="#"><h1 className="unfinishedlinks" style={{color: "red"}}>There are no tasks!</h1></a>)
    }
    else if (this.state.tasks.length) {
      return (
        <span>
          {this.state.tasks.map(
            function(item){
              return item.completed ? <div key={Math.random() * time()}><a className="colornav" href="#"><p className="unfinishedlinks">{item.task}</p></a></div> :
              <div key={Math.random() * time()}><p className="unfinishedlinks">{item.task} <a className="icon-checkmark" onClick={()=> that.setToFinished(item.id)}></a></p></div>})}
              </span>
            );
}
}
});
var ProjectPage = React.createClass({
  getInitialState() {
    return {
      project: {}
    }
  },
  componentWillMount(){
    this.fetchData();
  },
  fetchData() {
    let that = this;
    this.setState({
      loading: true
    });
    request.get('http://127.0.0.1:3001/Projects/' + this.props.params.id)
    .set('authorization', localStorage.getItem("token"))
    .end(function(err, res) {
      that.setState({
        loading: false
      });
      if (err)
      that.setState({
        error: err
      });
      else {
        var data = JSON.parse(res.text);
        that.setState({project : data});
      }
    });
  },
  renderTaskOverlay() {
    return (
      <div className="overlay">
         <div className="editform">
        <form>
        <input style={{color: 'black'}} type="text" placeholder="Task..." className="topinput" ref='task'></input>
       <input style={{color: 'black'}} type="text" placeholder="Priority (Integer value)..." className="tasksubinput" ref='priority'></input>
        <input type="button" value="Submit Task" className="btn-success submitExpense" onClick={this.postNewTask}></input>
        </form>
      <a href="#"><span className="Xoff" onClick={this.closeOverlay}>X</span></a></div>
      </div>
    )
  },
  openOverlay() {
      this.setState({
        addingTask: true
      });
    },
    closeOverlay() {
      this.setState({
        addingTask: false
      });
},
      postNewTask() {
        var that = this;
        request
        .post('http://127.0.0.1:3001/Projects/' + this.props.params.id + '/Tasks')
        .set('authorization', localStorage.getItem("token"))
        .send({ projectId: this.props.params.id, task: this.refs.task.value, priority: this.refs.priority.value})
        .end(function(err, res) {
          if (err || !res.ok) {
            console.log(err);
          }
          that.fetchData();
        });
        that.closeOverlay();

      },
  render() {
              if (this.state.loading) {
                return <div>loading...</div>;
              }
                            return (
                <span>
                <header>
                  <div className="logo">
                    <p className="headertext">{this.state.project.name}</p>
                  </div>
                  <div className="nav">
                    <ul>
                      <Link to="/projects"><li>All Projects</li></Link>
                    </ul>
                  </div>
                </header>
                  <div className="menu">
                  <a onClick={this.openOverlay} className="colornav" href="#"><p className="unfinishedlinks" style={{fontWeight: 'bold', fontSize: '1.2em'}}>Create new task...</p></a>
    {this.state.addingTask ? this.renderTaskOverlay() : null}
                  <UnfinishedTasks crocodile={this.state.project.id}/>
                  </div>
                  <div className="main">
<ProgressBar crocodile={this.state.project.id}/>
  <div className="projectNav">
    <ul className="projectUl">
<Link to={`/projects/${this.state.project.id}`}><li className="projectOption ">Overview</li></Link>
<Link activeClassName="current" to={`/projects/${this.state.project.id}/expenses`}><li className="projectOption">Expenses</li></Link>
<Link activeClassName="current" to={`/projects/${this.state.project.id}/notes`}><li className="projectOption">Notes</li></Link>
<Link activeClassName="current" to={`/projects/${this.state.project.id}/hours`}><li className="projectOption">Hours</li></Link>
<Link activeClassName="current" to={`/projects/${this.state.project.id}/externaldocs`}><li className="projectOption">External Docs</li></Link>
    </ul>
  </div>
  {this.props.children}
</div>
</span>
              );
            }
});
var OverViewSetup = React.createClass({
  componentDidMount() {
    hub.on('refresh_data', this.fetchData);
  },
  componentWillMount() {
    this.fetchData();
  },
  fetchData(){
    let that = this;
    this.setState({
      loading: true
    });
    request.get('http://127.0.0.1:3001/Projects/' + this.props.params.id)
    .set('authorization', localStorage.getItem("token"))
    .end(function(err, res) {
      that.setState({
        loading: false
      });
      if (err) {
        that.setState({
          error: err
        })
      }
      else {
        var data = JSON.parse(res.text);
        that.setState({tasksprojects : data});
    request.get('http://127.0.0.1:3001/Projects/' + that.props.params.id + '/Tasks')
    .set('authorization', localStorage.getItem("token"))
    .end(function(err, res) {
      that.setState({
        loading: false
      });
      if (err) {
        that.setState({
          error: err
        })
      }
      else {
        var data = JSON.parse(res.text);
        that.setState({tasks : data});
      }
    });
  }
});
  },

  render : function() {
    if (this.state.loading){
      return <div>Loading...</div>
    }
    else if (this.state.tasks) {
      return (
      <span>
      <div className="projectDescriptionBox magictime spaceInDown">{this.state.tasksprojects.description}</div>
      <FinishedTasks tasks={this.state.tasks}/>
      </span>
      )
    }
    else {
      return null;
    }
  }
});
var OverviewPage = React.createClass({
  componentWillMount (){
    this.fetchData();
  },
  componentDidMount() {
    hub.on('refresh_data', this.fetchData);
  },
  fetchData(){
    let that = this;
    this.setState({
      loading: true
    });
    request.get('http://127.0.0.1:3001/Projects/' + this.props.params.id + '/Tasks')
    .set('authorization', localStorage.getItem("token"))
    .end(function(err, res) {
      that.setState({
        loading: false
      });
      if (err)
      that.setState({
        error: err
      })
      else {
        console.log(res.text);
        var data = JSON.parse(res.text);
        that.setState({tasks : data});
        console.log(data);
      }
    });
  },
  render: function () {
    return (
<p>Getting Projects...</p>
    );
  },
});


var FinishedTasks = React.createClass({
  deleteTask(id){
    let that = this;

    console.log(id);
    request.delete('http://127.0.0.1:3001/Projects/Tasks/' + id)
    .set('authorization', localStorage.getItem("token"))
    .end(function(err, res) {
      if(err){console.log(err)}
      //Need to force update or change route
      hub.emit('refresh_data');
    });
  },
  toUnfinished(id){
    let that = this;
    console.log(id);
    request.put('http://127.0.0.1:3001/Projects/Tasks/' + id)
    .set('authorization', localStorage.getItem("token"))
    .send({completed: 0})
    .end(function(err, res) {
      if(err){console.log(err)}
      //Need to force update or change route
      hub.emit('refresh_data');
    });
  },
  render() {
    let that = this;
    var finishedTasks = this.props.tasks.filter(function(task) {return task.completed === 1});

if (!finishedTasks.length){
      return (
        <table className="finishedTasks  magictime spaceInDown">
        <tbody><tr>
            <th style={{color: 'green'}} className="title" colSpan={2}>Finished Tasks
            </th></tr>
        <tr>
        <td>There are no finished tasks!</td></tr>
              </tbody></table>)
    }
    else {
      return (
        <table className="finishedTasks  magictime spaceInDown">
      <tbody><tr>
          <th style={{color: 'green'}} className="title" colSpan={2}>Finished Tasks
          </th></tr>
        {finishedTasks.map(function(item){
          return (<tr key={Math.random() * time()} ><td>{item.task}</td><td><a href="#" id={item.id} onClick={() =>that.toUnfinished(item.id)}>Set to unfinished</a> <a href="#" id={item.id} onClick={() =>that.deleteTask(item.id)}>Delete</a> </td></tr>)
          })}</tbody></table>)
        }
}
});

var ProgressBar = React.createClass({
  getInitialState : function () {
    return {
      use: this.props.crocodile,
      tasks: [],
      finished: []
    }
  },
  componentWillReceiveProps : function(nextProps) {
    if (this.props.crocodile !== nextProps.crocodile) {
      this.fetchData(nextProps.crocodile);
        }
  },
  componentWillMount: function () {
    this.fetchData(this.props.crocodile)
  },
  componentDidMount() {
    hub.on('refresh_data', this.fetchData);
  },
  fetchData: function(id) {
    id = id || this.props.crocodile;
    if (!id) {
      return;
    }
    let that = this;
    that.setState({
      loading: true
    });
    request.get('http://127.0.0.1:3001/Projects/' + id + '/Tasks')
    .set('authorization', localStorage.getItem("token"))
    .end(function(err, res) {
      that.setState({
        loading: false
      });
      if (err)
      that.setState({
        error: err
      });
      else {
        let data = JSON.parse(res.text)
        let finished = data.filter(function(item){return item.completed === 1});
        let unfinished = data.filter(function(item){return item.completed === 0});
        that.setState({finished: finished, unfinished: unfinished, tasks: data});
      }
    });
  },
  render() {
    if (this.state.loading || !this.state.tasks.length) {
      return (<div style={{height: '5%', borderRadius: 0, marginBottom: 0, borderRight: '1px solid #000'}} className="progress">
        <div style={{zIndex: 10000, color: '#000', fontFamily: 'Kanit', marginTop: '7.5px', position: 'absolute', width: '100%', minWidth: '100%', textAlign: 'center'}}>No available tasks...</div>
        <div style={{width: 0 + "%"}} aria-valuemax={100} aria-valuemin={0} aria-valuenow={40} role="progressbar" className="progress-bar  progress-bar-success progress-bar-striped active">
        </div>
      </div>)
}
else if (this.state.tasks.length) {
  return (<div style={{height: '5%', borderRadius: 0, marginBottom: 0, borderRight: '1px solid #000'}} className="progress">
    <div style={{zIndex: 10000, color: '#000', fontFamily: 'Kanit', marginTop: '7.5px', position: 'absolute', width: '100%', minWidth: '100%', textAlign: 'center'}}>{ Math.floor((this.state.finished.length / this.state.tasks.length) * 100) + "% Completed" } </div>
    <div style={{width: ((this.state.finished.length / this.state.tasks.length) * 100) + "%"}} aria-valuemax={100} aria-valuemin={0} aria-valuenow={40} role="progressbar" className="progress-bar  progress-bar-success progress-bar-striped active">
    </div>
  </div>)
    }
}
});

var ExpensePage = React.createClass({
  componentWillMount() {
    this.fetchData();
  },
  fetchData() {
    this.setState({
      loading: true
    });
    var that = this;
    request.get('http://127.0.0.1:3001/Projects/' + this.props.params.id)
    .set('authorization', localStorage.getItem('token'))
    .end(function (err, res) {
      if (err)
      that.setState({
        error: err
      });
      else {
        let data = JSON.parse(res.text)
        that.setState({projectExpenses : data});

        request.get('http://127.0.0.1:3001/Projects/' + that.props.params.id + '/NetExpense')
        .set('authorization', localStorage.getItem("token"))
        .end(function (err, res) {
          that.setState({
            loading: false
          });
          if (err)
          that.setState({
            error: err
          });
          else {
            let data = JSON.parse(res.text)
            that.setState({expenses : data});
          }
        });
      }
    });

  },
  renderExpenseOverlay() {
    return (
      <div className="overlay">
         <div className="editform">
        <form name='expenseForm'><input type="text" placeholder="Expense (Name)" className="topinput" ref='expenseName'></input>
        <input type="text" placeholder="Expense (Amount)" className="subinput" ref='expenseAmount'></input>
       <input type="text" placeholder="Date" className="dateinput" ref='expenseDate'></input>
        <textarea className="noteinput" placeholder="Notes (Leave blank if none)" form='expenseForm' ref='expenseNote'></textarea>
        <input type="button" value="Submit New Expense" className="btn-success submitExpense" onClick={this.postNewExpense}></input>
        </form>
      <a href="#"><span className="Xoff" onClick={this.closeOverlay}>X</span></a></div>
      </div>
    )
  },
  openOverlay() {
    this.setState({
      addingExpense: true
    });
  },
  closeOverlay() {
    this.setState({
      addingExpense: false
    })
  },
  GenDate (){
    return (new Date()).now();
  },
  postNewExpense (){
    var that = this;
    console.log(this.refs);
    request
    .post('http://127.0.0.1:3001/Projects/' + this.props.params.id + '/NetExpense')
    .set('authorization', localStorage.getItem("token"))
    .send({ projectId: this.props.params.id, expense: this.refs.expenseName.value, amount: this.refs.expenseAmount.value, date: this.refs.expenseDate.value})
    .end(function(err, res) {
      if (err || !res.ok) {
        console.log(err);
      }
      that.fetchData();
    });
    that.closeOverlay();

  },
  render() {
    if(this.state.loading){
      return <div>Loading...</div>
    }
    var totalBug = this.state.projectExpenses?this.state.projectExpenses.budget:null;
    var usedBug = this.state.expenses?addTotalUsed(this.state.expenses) : 0;
return (
  <div className="container1">
    <div className="projectDescriptionBox1  magictime spaceInDown">
      <p style={{textAlign: 'center', position: 'absolute', top: 3, left: 0, width: '100%'}}>Project Budget</p>
      <p style={{textAlign: 'center', position: 'absolute', top: 30, left: 0, width: '100%'}}><span style={{color: 'green'}}>Total Budget</span> <span style={{color: 'red'}}>Total Used</span> <span style={{color: 'blue'}}>Total Available</span></p>
      <div className="projectBudget">
        <div className="totalBudget"><p style={{transform: 'rotate(180deg)', textAlign: 'center', verticalAlign: 'middle', color: 'white'}}>${totalBug}</p></div>
        <div className="totalUsed" style={{ maxHeight: (usedBug / totalBug) * 100 + '%'}}><p style={{transform: 'rotate(180deg)', textAlign: 'center', verticalAlign: 'middle', color: 'white'}}>${usedBug}</p></div>
        <div className="totalAvailable" style={{ maxHeight: 100 - ((usedBug / totalBug) * 100) + '%'}}><p style={{transform: 'rotate(180deg)', textAlign: 'center', verticalAlign: 'middle', color: 'white'}}>${totalBug - usedBug}</p></div>
      </div>
    </div>
    <Expense addExpense={this.openOverlay} expenses={this.state.expenses}/>

    {this.state.addingExpense ? this.renderExpenseOverlay() : null}
  </div>
)
  }
});

var Expense = React.createClass({
  render(){
  return (
    <table className="expenselist magictime tinDownIn">
      <tbody><tr>
          <th colSpan={3} className="title" style={{color: 'green'}}>Project Expenses
          </th></tr>
        <tr>
          <td colSpan={3} className="even" style={{fontWeight: 'bold'}}><a href='#' onClick={this.props.addExpense}> Add an Expense...</a></td>
        </tr>
        <tr>
          <td className="odd" colSpan={1} style={{fontWeight: 'bold', color: 'blue'}}>Expense</td>
          <td className="odd" colSpan={1} style={{fontWeight: 'bold', color: 'red'}}>Amount</td>
          <td className="odd" colSpan={1} style={{fontWeight: 'bold', color: 'green'}}>Date</td>
        </tr>
        {this.props.expenses?this.props.expenses.map(function(item){return <tr key={Math.random() * time()} projectId={item.projectId}><td>{item.expense}</td><td>${item.amount}</td><td>{item.date.substring(0, 10)}</td></tr> }):null}


      </tbody></table>
  )
}
});


var NotesPage = React.createClass ({
  componentWillMount(){
    this.fetchData();
  },
  fetchData() {
    this.setState({
      loading: true
    });
    var that = this;
    request.get('http://127.0.0.1:3001/Projects/' + this.props.params.id + '/Notes')
    .set('authorization', localStorage.getItem("token"))
    .end(function (err, res) {
      that.setState({
        loading: false
      });
      if (err)
      that.setState({
        error: err
      });
      else {
        let data = JSON.parse(res.text)
        that.setState({ notes: data});
      }
    });
  },
  postNote(){
    var that = this;
    console.log(this.refs);
    request
    .post('http://127.0.0.1:3001/Projects/' + this.props.params.id + '/Notes')
    .set('authorization', localStorage.getItem("token"))
    .send({ projectId: this.props.params.id, text: this.refs.noteText.value })
    .end(function(err, res) {
      if (err || !res.ok) {
        console.log(err);
      }
      that.fetchData();
    });
  },
  render(){
    if(this.state.loading){
      return <div>Loading...</div>;
    }
    return (
     <div><table className="finishedTasks magictime spaceInDown"><tbody><tr>
          <th style={{color: 'green'}} className="title" colSpan={2}>Notes
          </th></tr>{this.state.notes?this.state.notes.map(function(item){return <tr key={Math.random() * time()} projectId={item.projectId}><td>{item.text}</td></tr>}) : <tr><td>No Notes</td></tr>}</tbody></table>
<br/>
            <form name='noteForm' onSubmit={this.postNote}>
              <textarea placeholder="Enter note..." className="notesInputCompleted magictime spaceInDown" type="text" defaultValue={""} form='noteForm' ref='noteText'/>
                    <input type="submit" style={{marginBottom: '2%'}} defaultValue="Submit" className="hoursInputButton btn btn-primary magictime spaceInDown" />

                    </form>
                  </div>
    )
  }
});

var HoursPage = React.createClass({
  componentWillMount() {
    this.fetchData();
  },
  fetchData() {
    this.setState({
      loading: true
    });
    var that = this;
    request.get('http://127.0.0.1:3001/Projects/' + this.props.params.id + '/Hours')
    .set('authorization', localStorage.getItem("token"))
    .end(function (err, res) {
      that.setState({
        loading: false
      });
      if (err)
      that.setState({
        error: err
      });
      else {
        let data = JSON.parse(res.text)
        that.setState({ hours: data});
      }
    });
},
postHours(){
  var that = this;
  request
  .post('http://127.0.0.1:3001/Projects/' + this.props.params.id + '/Hours')
  .set('authorization', localStorage.getItem("token"))
  .send({ projectId: this.props.params.id, completed: this.refs.completed.value, hours: this.refs.hours.value, workerName: this.refs.workerName.value })
  .end(function(err, res) {
    console.log(res);
    if (err || !res.ok) {
      console.log(err);
    }
    that.fetchData();
  });
},
render(){
  if(this.state.loading){
    return <div>Loading...</div>
  }
    return (
      <div>
       <table className="finishedTasks magictime spaceInDown"><tbody><tr>
            <th style={{color: 'green'}} className="title" colSpan={3}>Hours
            </th></tr>
          <tr><td style={{fontSize:'18px', fontWeight: 'bold', color: 'blue'}} colSpan={1} className="odd">Hours</td>
              <td style={{fontSize:'18px', fontWeight: 'bold', color: 'black'}} colSpan={1} className="odd">Name</td>
              <td style={{fontSize:'18px', fontWeight: 'bold', color: 'green'}} colSpan={1} className="odd">Task</td></tr>
              {this.state.hours?this.state.hours.map(function(item){return <tr key={Math.random() * time()} projectId={item.projectId}><td>{item.hours}</td><td>{item.workerName}</td><td>{item.completed}</td></tr>}) : <tr><td colSpan={3}>No Hours</td></tr>}</tbody></table>
<form name='hoursForm'>
  <textarea placeholder="Enter what you completed in the hours worked..." className="hoursInputCompleted magictime spaceInDown" type="text" defaultValue={""} ref='completed' />
        <input type="text" placeholder="How many hours?" className="hoursInputHours magictime spaceInDown" ref='hours'/>
        <input type="text" placeholder="Name..." className="hoursInputName magictime spaceInDown" ref='workerName'/>
        <input onClick={this.postHours} type="button" style={{marginBottom: '2%'}} defaultValue="Submit" className="hoursInputButton btn btn-primary magictime spaceInDown" />

        </form>


    </div>
    )

}
});

var ExternalDocs = React.createClass({
componentWillMount() {
  this.fetchData();
},
fetchData(){
  this.setState({
    loading: true
  });
  var that = this;
  request.get('http://127.0.0.1:3001/Projects/' + this.props.params.id + '/ExternalDocs')
  .set('authorization', localStorage.getItem("token"))
  .end(function (err, res) {
    that.setState({
      loading: false
    });
    if (err)
    that.setState({
      error: err
    });
    else {
      let data = JSON.parse(res.text)
      that.setState({ docs: data});
    }
  });
},
postDocs(){
  console.log(this.refs);
  var that = this;
  request
  .post('http://127.0.0.1:3001/Projects/' + this.props.params.id + '/ExternalDocs')
  .set('authorization', localStorage.getItem("token"))
  .send({ projectId: this.props.params.id, document: this.refs.document.value, website: this.refs.website.value, documentation: this.refs.documentation.value })
  .end(function(err, res) {
    console.log(res);
    if (err || !res.ok) {
      console.log(err);
    }
    that.fetchData();
  });
},
render(){
  if(this.state.loading){
    return <div>Loading...</div>
  }
    return (
      <div>
       <table className="finishedTasks magictime spaceInDown"><tbody><tr>
            <th style={{color: 'green'}} className="title" colSpan={2}>External Documents
            </th></tr>
          <tr><td style={{fontSize:'18px', fontWeight: 'bold', color: 'blue'}} colSpan={1}>Document</td>
              <td style={{fontSize:'18px', fontWeight: 'bold', color: 'black'}} colSpan={1}>Options</td></tr>
              {this.state.docs?this.state.docs.map(function(item){return <tr><td>{item.document}</td><td><a href={item.website}>Website</a> <a href={item.documentation}>Documentation</a></td></tr>}) : <tr><td colSpan={3}>No external documents...</td></tr>}</tbody></table>
<form>
  <textarea placeholder="Enter the document name..." className="hoursInputCompleted magictime spaceInDown" type="text" defaultValue={""} ref='document' />
        <input type="text" placeholder="Enter document website (Start with http://)..." className="hoursInputHours magictime spaceInDown" ref='website'/>
        <input type="text" placeholder="Enter documentation reference link..." className="hoursInputName magictime spaceInDown" ref='documentation'/>
        <input onClick={this.postDocs} type="button" style={{marginBottom: '2%'}} defaultValue="Submit" className="hoursInputButton btn btn-primary magictime spaceInDown" />

        </form>


    </div>
    )

}
});

      var routes = (
        <Router history={createHistory()}>
          <Route path="/" component={App}>
            <IndexRoute component={Login} />
            <Route path="signup" component={Signup}/>
            <Route path="projects" component={HeaderMenu}/>
            <Route path="projects/" component={HeaderMenu}/>
            <Route path="projects/:id" component={ProjectPage}>
              <IndexRoute component={OverViewSetup}/>
              <Route path="expenses" component={ExpensePage}/>
              <Route path="notes" component={NotesPage}/>
              <Route path="hours" component={HoursPage}/>
              <Route path="externaldocs" component={ExternalDocs}/>
            </Route>
          </Route>
        </Router>
      )
      ReactDOM.render(routes, document.querySelector('#main'))
