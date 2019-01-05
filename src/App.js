import React, { Component } from 'react';
import './App.css';
import Request from 'superagent';
import _ from 'lodash'

class Loading extends Component {
  render() {
    const firstDivStyle = {
      float: 'left',
      textAlign: 'center',
      width: '75%'
    };
    return (
      <div style={firstDivStyle} >
        <img height="80px" width="80px" src="https://media1.tenor.com/images/8ac12962c05648c55ca85771f4a69b2d/tenor.gif" />
      </div>
    )
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      items: [],
      searched: false,
      intro: "What'll you buy today?",
      loading: false
    };
  }

  componentWillMount() {
    this.search();
  }

  componentDidMount() {
  }

  updateSearch() {
    this.setState({
      loading: true
    });
    this.search(this.refs.query.value);
  }


  search(query = "") {

    var url = "http://es.backpackbang.com:9200/products/amazon/_search?q=title:" + query;

    Request.get(url).then((response) => {
      this.setState({
        products: response.body.hits.hits,
        total: response.body.totalResults,
        searched: true,
        intro: "",
        loading: false
      });
    });
  }

  addToCart(x) {
    var tmp = this.state.items;
    tmp.push(x);
    this.setState({ items: tmp });
  }


  render() {
    var products = _.map(this.state.products, (product) => {
      return <li> <img className="Product-img" src={product._source.images} /> <span><b>{product._source.title}</b></span>
        <span id="price"><i>&nbsp;&nbsp;${product._source.price}</i></span>
        <button id="atc" onClick={(e) => { this.addToCart(product); }}>  Add to Cart </button>
      </li>;
    });

    const firstDivStyle = {
      float: 'left',
      textAlign: 'center',
      width: '75%',
    };

    const secondDivStyle = {
      float: 'left',
      width: '23%',
    };

    const thirdDivStyle = {
      clear: 'both'
    };

    const productListStyle = {
      float: 'left',
      width: '75%'
    }

    const introStyle = {
      float: 'left',
      textAlign: 'center',
      width: '75%',
    }


    return (
      <div>
        <div style={firstDivStyle}>
          {this.state.text}
          <input ref="query" type="text" placeholder="Search..." />
          <button onClick={(e) => { this.refs.query.value.length > 0 ? this.updateSearch() : null }}> Search </button>


          {(this.state.searched && this.state.products.length < 1) && (
            <div>Sorry, that thing doesn't seem to exist. Try anything else?</div>
          )}
        </div>

        <div style={introStyle}>
          {this.state.intro}
        </div>

        <div style={productListStyle}>
          <ul className="Product-list"> {products} </ul>
        </div>

        <div style={secondDivStyle}>
          <Cart items={this.state.items} />
        </div>
        <div style={thirdDivStyle}></div>
        {this.state.loading ? <Loading /> : null}
      </div>
    )
  }
}

class Cart extends Component {
  constructor(props) {
    super();
    this.state = {
      items: props.items,
      itemsInCart: "You have no items in your cart"
    }
  }

  addItem(x) {
    var tmp = this.state.items;
    tmp.push(x);
    this.setState({
      items: tmp
    });
  }

  clearCart() {
    var tmp = this.state.items;
    tmp.splice(0, tmp.length);
    this.setState({ items: tmp });
  }

  render() {
    const cartBordered = {
      borderwidth: 'thick',
      borderColor: '#000000',
      borderStyle: 'none none none solid',
      width: '100%',

    };

    const buttonStyle = {
      float: 'right'
    };

    const headerStyle = {
      textAlign: 'center'
    };

    var output = _.map(this.state.items, (product) => {
      return <div><p>&nbsp;</p> <li> <p>{product._source.title} &nbsp; &nbsp; &nbsp; &nbsp; $ {product._source.price}</p>
      </li> </div>;
    })
    return (
      <div id="cart-header">
        <span>
          <h2 style={headerStyle}>Cart</h2>
        </span>


        <div style={cartBordered}>
          {output.length > 0 && (
            <button style={buttonStyle} onClick={(e) => { this.clearCart(); }}> Clear Cart </button>

          )}

          {output.length < 1 && (
            <button style={buttonStyle} onClick={(e) => { return; }} disabled={true}> Clear Cart</button>
          )}
          <ol> {output} </ol>
        </div>

        <div> {output.length < 1 ? <p>{this.state.itemsInCart}</p> : null} </div>



      </div>
    );
  }
}

export default App;
