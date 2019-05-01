// Main container for app
// Will: contain state, query API and interpret results, define functions for
// lower components to use
// Won't: display anything on its own

import React, { PureComponent } from 'react';
import classes from './PhotoTagger.module.scss';
import Moment from 'moment';
import Modal from '../../HOC/Modal/Modal';
import Header from '../../Components/Header/Header';
import Photo from '../../Components/Photo/Photo';

class PhotoTagger extends PureComponent{
  state = {
    'userSelection': 'Leonardo',
    'scoreCard': {},
    'showScoreModal': false,
    'showSubmissionModal': true
  };

  async componentDidMount(){
    const response = await fetch(`http://localhost:4500/target/${this.state.userSelection}`);
    const json = await response.json();
    const turtleData = {...json[0]};
    this.setState({'turtleData': turtleData});
    this.setState({'startTime': Moment()})
  }

  positionChecker = async (e) => {
    const image = document.querySelector('#Photo');
    const imageHeight = image.clientHeight;
    const imageWidth = image.clientWidth;
    const mouseXPosition = (e.clientX + window.scrollX);
    const mouseYPosition = (e.clientY + window.scrollY);
    const percentageXPosition = mouseXPosition / imageWidth;
    const percentageYPosition = mouseYPosition / imageHeight;

    const turtle = this.state.turtleData;

    const topLeft = [...turtle.topLeft];
    const bottomRight = [...turtle.bottomRight];
    const insideXBounds = topLeft[0] < percentageXPosition && percentageXPosition < bottomRight[0];
    const insideYBounds = topLeft[1] < percentageYPosition && percentageYPosition < bottomRight[1];

    return (insideXBounds && insideYBounds);
  };

  menuClickHandler = (turtle) => {
    if(this.state.scoreCard[turtle]) return;
    this.setState({'userSelection': turtle});
  };

  photoClickHandler = (e) => {
    const scoreCard = {...this.state.scoreCard};
    // If they clicked the correct turtle, record that.
    if(this.positionChecker(e)){
      if(!scoreCard[this.state.userSelection]){
        scoreCard[this.state.userSelection] = true;
      }
    }
    this.wonGameDetector(scoreCard);
  };

  wonGameDetector = (scoreCard) => {
    console.log(Object.keys(scoreCard));
    if(Object.keys(scoreCard).length > 3){
      // If there are four distinct records, they won. Record their time.
      scoreCard.time = Moment().diff(this.state.startTime, 'seconds');
      // Open the modal to allow them to enter their name.
    }
    this.setState({'scoreCard': scoreCard});
  };

  toggleScoreModal = () => {
    this.setState({ showScoreModal: !this.state.showScoreModal })
  }

  toggleSubmissionModal = () => {
    this.setState({ showSubmissionModal: !this.state.showSubmissionModal })
  }

  render(){
    return (
      <div className={classes.PhotoTagger}>
        {/* Score Modal */}
        <Modal
          showModal={this.state.showScoreModal}
          toggleModal={this.toggleScoreModal}>
          <p>Score</p>
        </Modal>
        {/* Game End Modal */}
        <Modal
          onlyCloseWithX
          showModal={this.state.showSubmissionModal}
          toggleModal={this.toggleSubmissionModal}>
          <p>You win!</p>
        </Modal>
        <Header
          nameClick={this.menuClickHandler}
          userSelection={this.state.userSelection}
          scoreCard={Object.keys(this.state.scoreCard)}
          toggleModal={this.toggleScoreModal}
        />
        <Photo
          click={this.photoClickHandler}
        />
      </div>
    );
  }
}

export default PhotoTagger;