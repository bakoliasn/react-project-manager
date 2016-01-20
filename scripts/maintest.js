// var React = require('react');
// var ReactDOM = require('react-dom');
// var request = require('superagent');
// import { Router, Route, IndexRoute, RouteHandler, Link } from 'react-router';
// import { createHistory } from 'history';
//
//
//
// var App = React.createClass({
//   getInitialState: function () {
//     return {
//       tasks:[],
//       todo:[],
//       hours:[],
//       NetExpense: [],
//       externalDocs: [],
//       notes:[],
//       projects: []
//     }
//   },
//   render() {
//     return (
//       <div>
//         {this.props.children}
//       </div>
//     )
//   }
// });
//
// var Login = React.createClass({
//   giveData: function (event) { //changed function to ES6
//     const that = this;
//     event.preventDefault();
//     request
//     .post('http://127.0.0.1:3001/login')
//     .set('Accept', 'application/json')
//     .send({ email: that.refs.loginEmail.value, password: that.refs.loginPass.value })
//     .end(function(err, res) {
//       if (err || !res.ok) {
//         console.log(err);
//       } else {
//         localStorage.setItem("token", res.text);
//         that.props.history.pushState(null, '/projects');
//       }
//     });
//   },
//   render: function (){
//     return (
//       <div>
//         <form id="loginForm" onSubmit={this.giveData}>
//           <input
//             ref="loginEmail"
//             type="text"
//             placeholder="Email"
//             name="email" />
//           <input
//             ref="loginPass"
//             type="password"
//             placeholder="Password"
//             name="password" />
//           <input type="submit" name="submit"/>
//
//         </form>
//       </div>
//     )
//   }
// });
//
//
//
// var HeaderMenu = React.createClass({
//   getInitialState: function() {
//     return{
//       projects:[]
//     }
//   },
//
//   componentWillMount : function() {
//     let that = this;
//     this.setState({
//       loading: true
//     });
//     request.get("http://127.0.0.1:3001/Projects")
//     .set('Authorization', localStorage.getItem("token"))
//     .end(function(err, res) {
//       that.setState({
//         loading: false
//       });
//       if (err)
//       that.setState({
//         error: err
//       })
//       else {
//         let data = JSON.parse(res.text)
//         that.setState({projects : data});
//       }
//     })
//   },
//   render : function() {
//     let that = this;
//     return (
//       <div>
//         <header>
//           <div className="logo">
//             <p className="headertext">PRJCTMNGMT</p>
//           </div>
//           <div className="nav">
//             <ul>
//               <li>
//                 <a href="#">Settings</a>
//               </li>
//               <li>
//                 <a href="#">
//                   New Project
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </header>
//         <div className="indexmenu">
//           <p className="username">
//             {this.props.username}
//           </p>
//           <p className="totalprojects">
//             {this.props.totalproject} Projects
//           </p>
//         </div>
//         <section className='main'>
//           <div className="project">
//             <div className="projectDetails">
//               <p className="projectName">
//                 New Project
//               </p>
//               <input
//                 type="button"
//                 className="btn-primary projectView"
//                 defaultValue="New Project" />
//             </div>
//           </div>
//           {this.renderProject()}
//         </section>
//       </div>
//     )
//   },
//   renderProject() {
//     if (this.state.error) {
//       return 'An error occurred: ' + JSON.stringify(this.state.error);
//     }
//     else if (this.state.loading || !this.state.projects) {
//         return 'loading...';
//     }
//     else {
//       return (
//         <span>
//           {this.state.projects.map(
//             function(item){
//               return <Project
//                 key={item.id}
//                 projectname={item.name}
//                 id={item.id}
//                 projectBudget={item.budget}
//                 projectDescription={item.description}
//                 />})}
//               </span>
//             );
//
//
//           }
//     }
//       });
//
//
//
//
//
//
//
//
//
//       var Project = React.createClass({
//         render: function () {
//           return (
//             <div className="project">
//               <div className="projectDetails">
//                 <p className="projectName">
//                   {this.props.projectname}
//                 </p>
//                 <Link to={`/Projects/${this.props.id}`} className="btn btn-sucess projectView" >
//                 View
//                 </Link>
//               </div>
//             </div>
//           )
//         }
//       });
//
//
// var UnfinishedTasks = React.createClass({
//   componentWillMount: function() {
//     let that = this;
//     request.get('http://127.0.0.1:3001/Projects/' + this.props.projectId + '/Tasks')
//     .set('Authorization', localStorage.getItem("token"))
//     .end(function(err, res) {
//       that.setState({
//         loading: false
//       });
//       if (err)
//       that.setState({
//         error: err
//       });
//       else {
//         let data = JSON.parse(res.text)
//         that.setState({tasks : data});
//       }
//     });
//   },
//   render: function() {
//     return <ul><li>unfinished tasks</li></ul>
//   }
// })
//
//
// var ProjectPage = React.createClass({
//   getInitialState() {
//     return {
//       project: {}
//     }
//   },
//   componentWillMount: function(){
//     let that = this;
//     this.setState({
//       loading: true
//     });
//     request.get('http://127.0.0.1:3001/Projects/' + this.props.params.id)
//     .set('Authorization', localStorage.getItem("token"))
//     .end(function(err, res) {
//       that.setState({
//         loading: false
//       });
//       if (err)
//       that.setState({
//         error: err
//       });
//       else {
//         var data = JSON.parse(res.text);
//         console.log(data, '<<<<<<');
//         that.setState({project : data});
//       }
//     });
//   },
//   render: function() {
//               if (this.state.loading) {
//                 return <div>loading...</div>;
//               }
//
//               return (
//                 <div>
//                   <h2>{this.state.project.name}</h2>
//                   <div>
//                     <div style={{float: 'left', width: '20%', borderRight: '1px solid red', backgroundColor: 'black'}}>
//                       <UnfinishedTasks projectId={this.props.params.id}/>
//                     </div>
//                     <div style={{overflow: 'hidden'}}>
//                       {this.props.children}
//                     </div>
//                   </div>
//                 </div>
//               );
//             }
// });
//
// var OverviewPage = React.createClass({
//   componentWillMount: function(){
//     let that = this;
//     this.setState({
//       loading: true
//     });
//     request.get('http://127.0.0.1:3001/Projects/' + this.props.params.id + '/Tasks')
//     .set('Authorization', localStorage.getItem("token"))
//     .end(function(err, res) {
//       that.setState({
//         loading: false
//       });
//       if (err)
//       that.setState({
//         error: err
//       })
//       else {
//         console.log(res.text);
//         var data = JSON.parse(res.text);
//         that.setState({tasks : data});
//         console.log(data);
//       }
//     });
//   },
//   render: function () {
//     return (
//       <header>
//          //     <div className="logo">
//          //       <p className="headertext">PROJECTNAME</p>
//          //     </div>
//          //     <div className="nav">
//          //       <ul>
//          //         <li><a href="#">Settings</a></li>
//          //         <li><a href="index.html">All Projects</a></li>
//          //       </ul>
//          //     </div>
//          //   </header>
//            <div className="menu">
//              <table className="unfinishedTasks">
//                <tbody><tr>
//                    <td className="title" style={{color: 'red', textAlign: 'center'}}>Unfinished Tasks</td>
//                  </tr>
//                  <tr>
//                    <td className="largerfont"><a href="#" className="colornav"><p className="unfinishedlinks">HTML</p></a></td>
//                  </tr>
//                  <tr>
//                    <td className="largerfont"><a href="#" className="colornav"><p className="unfinishedlinks">CSS</p></a></td>
//                  </tr>
//                  <tr>
//                    <td className="largerfont"><a href="#" className="colornav"><p className="unfinishedlinks">Javascript</p></a></td>
//                  </tr>
//                  <tr>
//                    <td className="largerfont"><a href="#" className="colornav"><p className="unfinishedlinks">JQuery</p></a></td>
//                  </tr>
//                  <tr>
//                    <td className="largerfont"><a href="#" className="colornav"><p className="unfinishedlinks">PHP</p></a></td>
//                  </tr>
//                  <tr>
//                    <td className="largerfont"><a href="#" className="colornav"><p className="unfinishedlinks">PHP</p></a></td>
//                  </tr>
//                  <tr>
//                    <td className="largerfont"><a href="#" className="colornav"><p className="unfinishedlinks">PHP</p></a></td>
//                  </tr>
//                  <tr>
//                    <td className="largerfont"><a href="#" className="colornav"><p className="unfinishedlinks">PHP</p></a></td>
//                  </tr>
//                  <tr>
//                    <td><a href="#" className="colornav"><p className="unfinishedlinks">Create New Task...</p></a></td>
//                  </tr>
//                </tbody></table>
//            </div>
//            <div className="main">
//              <div className="progress" style={{height: '5%', borderRadius: 0, marginBottom: 0, borderRight: '1px solid #000'}}>
//                <div style={{zIndex: 10000, color: '#000', fontFamily: 'Kanit', marginTop: '7.5px', position: 'absolute', width: '100%', minWidth: '100%', textAlign: 'center'}}>Project Completed!</div>
//                <div className="progress-bar  progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100} style={{width: '100%'}}>
//                </div>
//              </div>
//              <div className="projectNav">
//                <ul className="projectUl">
//                  <a href="project.html"><li className="projectOption current">Overview</li></a>
//                  <a href="expenses.html"><li className="projectOption">Expenses</li></a>
//                  <a href="notes.html"><li className="projectOption">Notes</li></a>
//                  <a href="hours.html"><li className="projectOption">Hours</li></a>
//                  <a href="external.html"><li className="projectOption">External</li></a>
//                </ul>
//              </div>
//              <div className="projectDescriptionBox magictime spaceInDown">Project Description... This is an example project and words to fill the space.</div>
//              <table className="finishedTasks  magictime spaceInDown">
//                <tbody><tr>
//                    <th colSpan={2} className="title" style={{color: 'green'}}>Finished Tasks
//                    </th></tr>
//                  <tr>
//                    <td className="even">HTML</td>
//                    <td className="even"><a href="#">View</a>  <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                  <tr>
//                    <td className="odd">CSS</td>
//                    <td className="odd"><a href="#">View</a>  <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                  <tr>
//                    <td className="even">Javascript</td>
//                    <td className="even"><a href="#">View</a>  <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                  <tr>
//                    <td className="odd">JQuery</td>
//                    <td className="odd"><a href="#">View</a> <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                  <tr>
//                    <td className="even">PHP</td>
//                    <td className="even"><a href="#">View</a>  <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                  <tr>
//                    <td className="odd">MYSQL</td>
//                    <td className="odd"><a href="#">View</a> <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                  <tr>
//                    <td className="even">Login Form</td>
//                    <td className="even"><a href="#">View</a>  <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                  <tr>
//                    <td className="odd">Login Form</td>
//                    <td className="odd"><a href="#">View</a>  <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                  <tr>
//                    <td className="even">Login Form</td>
//                    <td className="even"><a href="#">View</a>  <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                  <tr>
//                    <td className="odd">Login Form</td>
//                    <td className="odd"><a href="#">View</a>  <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                  <tr>
//                    <td className="even">Login Form</td>
//                    <td className="even"><a href="#">View</a>  <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                  <tr>
//                    <td className="odd">Login Form</td>
//                    <td className="odd"><a href="#">View</a>  <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                  <tr>
//                    <td className="even">Login Form</td>
//                    <td className="even"><a href="#">View</a>  <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                  <tr>
//                    <td className="odd">Login Form</td>
//                    <td className="odd"><a href="#">View</a>  <a href="#">Edit</a>  <a href="#">Delete</a>  <a href="#">Set-Unfinished</a></td>
//                  </tr>
//                </tbody></table>
//              <br />
//            </div>
//          </div>
//
//
//     );
//   }
// });
//
//
//
//
//       var routes = (
//         <Router history={createHistory()}>
//           <Route path="/" component={App}>
//             <IndexRoute component={Login} />
//             <Route path="projects" component={HeaderMenu}/>
//             <Route path="projects/:id" component={ProjectPage}>
//               <IndexRoute component={OverviewPage}/>
//             </Route>
//           </Route>
//         </Router>
//       )
//
//
//
//       ReactDOM.render(routes, document.querySelector('#main'))
