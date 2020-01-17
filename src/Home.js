import React, { Component } from 'react';
import { Link } from "react-router-dom";
import search from './img/svg/search.svg';
import arrow from './img/svg/arrow.svg';
import star from './img/svg/star.svg';
import close from './img/svg/close.svg';
import scrollTop from './img/svg/scrollTop.svg';
const axios = require('axios');

export default class Home extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
            listLength: 2,
            dataTimeout: null,
            allMovie: false,
            infoLength: 100,
            castNameLength: 3,
            pageLength: 1,
            requestStatus: true,
            scrollTop: false
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', () => {
            var DOMScrollTop = document.documentElement.scrollTop;
            var DOMScrollHeigth = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var DOMScrollCalculate = DOMScrollTop / DOMScrollHeigth;

            if (DOMScrollCalculate >= 0.8) {
                if (this.state.requestStatus) {
                    this.setState({ requestStatus: false });
                    this.getData();
                }
            }

            DOMScrollTop < 550 ? this.setState({ scrollTop: false }) : this.setState({ scrollTop: true });
        }, true);
    }

    getData = () => {

        let state = this;
        let stateData = [];

        axios.get('http://www.omdbapi.com/?apikey=a77b259b&s=' + this.state.value + '&page=' + this.state.pageLength)
            .then(function (response) {
                response.data.Search.map((item) =>
                    axios.get('http://www.omdbapi.com/?apikey=a77b259b&i=' + item.imdbID)
                        .then(function (response) {
                            stateData.push(response.data);
                            state.setState({ data: state.state.data.concat(response.data), requestStatus: true, pageLength: state.state.pageLength + 1 });
                        })
                        .catch(function (error) {
                            console.log(error);
                        })
                );
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    onKeyUp = (e) => {
        this.setState({ data: [] })
        this.state.dataTimeout && clearTimeout(this.state.dataTimeout);

        this.setState({
            value: e.target.value, dataTimeout:
                setTimeout(() => {
                    this.getData();
                }, 1000)
        });
    }

    clickFalse = (e) => {
        e.preventDefault()
    }

    movieList = () => {
        let searchBar = document.querySelector("input");
        this.setState({
            allMovie: true
        })
        searchBar.value = `${this.state.value} için ${this.state.data.length} film bulundu`
        searchBar.setAttribute("disabled", "")
    }

    clearData = () => {
        let searchBar = document.querySelector("input");
        this.setState({
            data: [],
            allMovie: false,
            value: ""
        })
        searchBar.value = ""
        searchBar.removeAttribute("disabled")
    }

    scrollToTop = () => {
        let scrollStep = -window.scrollY / (2000 / 100), scrollInterval = setInterval(function () {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
    }

    render() {
        return (
            <div className="w-100 d-flex align-items-center flex-column">
                <div className={this.state.scrollTop ? "scroll-top active" : "scroll-top"} onClick={this.scrollToTop}><img src={scrollTop} alt="" /></div>
                <label id="search" className="w-100 position-relative mb-4">
                    <div className="search-bar-icon">
                        {this.state.value ? this.state.allMovie ? <div className="close-icon" onClick={this.clearData}><img alt="" src={close} /></div> : <div className="arrow-icon"><img alt="" src={arrow} /></div> : <div className="search-icon"><img alt="" src={search} /></div>}
                    </div>
                    <input className={this.state.allMovie ? "w-100 px-4 pl-2 pr-5 active" : "w-100 px-4 pl-2 pr-5"} placeholder="Bulmak istediğiniz filmin adını yazınız" onKeyUp={this.onKeyUp} type="text" />
                </label>
                {
                    this.state.allMovie ? <div className="container">
                        <div className="row">
                            {
                                this.state.data.map((item, index) =>
                                    <div className="col-6" key={index}>
                                        <li className="movie__item d-flex flex-column flex-sm-row">
                                            <figure className="mx-auto mb-3 mr-sm-3"><img alt={item.Title} src={item.Poster} /></figure>
                                            <article>
                                                <h4>{`${item.Title} (${item.Year})`}</h4>
                                                <div className="movie__rating">
                                                    <i><img alt="" src={star} /></i>
                                                    <span>{item.imdbRating}<small>/10</small></span>
                                                </div>
                                                <div className="movie__details">
                                                    <span>Dil: {item.Language}</span>
                                                    <span className="movie__cast-name">Oyuncular: {
                                                        item.Actors.split(",").map((item, index) =>
                                                            index < this.state.castNameLength ? item : null
                                                        )
                                                    } | <a href="/" onClick={this.clickFalse}>Tüm listeyi gör »</a>
                                                    </span>
                                                </div>
                                                <p className="info">{item.Plot.substr(0, this.state.infoLength)} <a href="/" onClick={this.clickFalse}>Detaylar »</a></p>
                                            </article>
                                        </li>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                        : this.state.value ? <div className="container">
                            <div className="row">
                                <ul className="movie px-4 rounded mx-auto">
                                    {
                                        this.state.data.map((item, index) =>
                                            index < this.state.listLength && (
                                                <div className="col-12" key={index}>
                                                    <li className="movie__item d-flex flex-column flex-sm-row">
                                                        <figure className="mx-auto mb-3 mr-sm-3"><img alt={item.Title} src={item.Poster} /></figure>
                                                        <article>
                                                            <h4>{`${item.Title} (${item.Year})`}</h4>
                                                            <div className="movie__rating">
                                                                <i><img alt="" src={star} /></i>
                                                                <span>{item.imdbRating}<small>/10</small></span>
                                                            </div>
                                                            <div className="movie__details">
                                                                <span>Dil: {item.Language}</span>
                                                                <span className="movie__cast-name">Oyuncular: {
                                                                    item.Actors.split(",").map((item, index) =>
                                                                        index < this.state.castNameLength ? item : null
                                                                    )
                                                                } | <a href="/" onClick={this.clickFalse}>Tüm listeyi gör »</a>
                                                                </span>
                                                            </div>
                                                            <p className="info">{item.Plot.substr(0, this.state.infoLength)} <a href="/" onClick={this.clickFalse}>Detaylar »</a></p>
                                                        </article>
                                                    </li>
                                                </div>
                                            )
                                        )
                                    }
                                    <Link to="/" className="more-movie w-100 text-center p-3 d-block" onClick={this.movieList}>DAHA FAZLA SONUÇ »</Link>
                                </ul>
                            </div>
                        </div> : null
                }
            </div>
        )
    }
}
