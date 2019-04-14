import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import NavBar from '../NavBar.js';
import OwnerList from '../components/owners/OwnerList';
import OwnerDetails from '../components/owners/OwnerDetails';
import PirateForm from '../components/owners/OwnerForm';
import Request from '../helpers/request';

class MainContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      owners: [],
      dogs: [],
      messages: [],
      comments: []
    };
    this.findOwnerById = this.findOwnerById.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    const request = new Request()
    const ownerPromise = request.get('/api/owners');
    const dogPromise = request.get('/api/dogs');
    const messagePromise = request.get('/api/messages');
    const commentPromise = request.get('/api/comments');

    const promises = [ownerPromise, dogPromise, messagePromise, commentPromise];

    Promise.all(promises)
    .then(data => {
      this.setState({
        pirates: data[0]._embedded.owners,
        dogs: data[1]._embedded.dogs,
        messages: data[2]._embedded.messages,
        comments: data[3]._embedded.comments,
      })
    })
  }

  findOwnerById(id) {
    const owner = this.state.owners.find((owner) => {
      return owner.id === parseInt(id);
    })
    return owner
  }

  handleDelete(id) {
    const request = new Request();
    const url = `/api/owners/${id}`;
    request.delete(url).then(() => {
      window.location = '/owners';
    });
  }

  render(){
    return (
      <div>
      <Router>
      <React.Fragment>
      <NavBar/>
      <Switch>
      {/* GET ALL OWNERS */}
      <Route exact path="/owners" render={(props) => {
        return <OwnerList owners = {this.state.owners} />
      }}/>

      <Route exact path = "/owners/new" render={(props) => {
        return <OwnerForm dogs = {this.state.dogs}/>
      }}/>

      <Route exact path="/owners/:id" render= {(props) => {
        const id = props.match.params.id;
        const pirate = this.findOwnerById(id);
        // console.log(owner);
        return <OwnerDetails owner={owner} onDelete={this.handleDelete}/>
      }}/>

      </Switch>
      </React.Fragment>
      </Router>
      </div>
    )
  }
}

export default MainContainer;
