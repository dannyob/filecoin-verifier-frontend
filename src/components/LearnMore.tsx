import React, { Component } from 'react';
// @ts-ignore
import { ButtonPrimary } from "slate-react-system";


class LearnMore extends Component {

    navigate = () => {
          window.open('https://docs.filecoin.io/store/filecoin-plus/', '_blank')
      }

    throwError = () => {
        
        throw new Error("This is to test the error handling");
    }

    render() {
        return (
            <div className="learnmore">
              <ButtonPrimary onClick={() => this.navigate()}>Learn More</ButtonPrimary>
              {/* <ButtonPrimary onClick={() => this.throwError()}>Learn More</ButtonPrimary> */}
            </div >
        )
    }
}

export default LearnMore;
