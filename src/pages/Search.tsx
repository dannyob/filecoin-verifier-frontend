import React, { Component } from 'react';
import { Data } from '../context/Data/Index'
import queryString from 'query-string';
import history from '../context/History'

type States = {
    results: any[]
}

interface Props {

}

class Search extends Component<Props, States> {
  public static contextType = Data

  constructor(props: Props) {
    super(props);
    this.state = {
        results: []
    }
  }

  componentDidMount () {
    this.loadSearch()
  }

  loadSearch = async () => {
    const {q} = queryString.parse(history.location.search)
    const results = await this.context.search(q)
    this.setState({results})
  }

  render() {
    return (
      <div>
          Search
      </div>
    );
  }
}

export default Search;
