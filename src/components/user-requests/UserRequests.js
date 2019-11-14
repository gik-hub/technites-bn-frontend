/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable class-methods-use-this */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { getUserRequests } from "../../redux/actions/RequestActions";
import { retrieveProfile } from "../../redux/actions/profileAction";
import HomeNav from "../home-nav/HomeNav";
import { Table } from "../table";
import SideBar from "../side-bar";
import Footer from "../footer";

export class UserRequests extends Component {
  constructor() {
    super();
    this.state = {
      requestFound: false,
      requests: [],
      errors: {},
      postsPerPage: 4,
      currentPage: 1,
      user: {},
    };
  }

  componentDidMount() {
    this.props.getUserRequests();
    this.props.retrieveProfile();
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps({ requests, errors, user }) {
    this.setState({ errors, requests, user });
    if (errors.error && typeof errors.error !== "object") {
      toast.error(errors.error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  render() {
    const columns = [
      "Reason",
      "Departure Date",
      "Request Type",
      "Requested on",
      "Status",
      "Actions",
    ];
    const { requests } = this.props.requests;
    const { user } = this.props;
    // Get current posts
    const indexOfLastElement = this.state.currentPage * this.state.postsPerPage;
    const indexOfFirstElement = indexOfLastElement - this.state.postsPerPage;
    const currentElements = requests.slice(
      indexOfFirstElement,
      indexOfLastElement,
    );
    // Change page
    const paginate = (currentPage) => this.setState({ currentPage });
    const edit = (
      <a href="#">Edit</a>
    );
    const elements = currentElements.map((request) => (
      <tr className="table-row" key={request.id}>
        <td className="table-element" id={request.id}>
          {request.reason}
        </td>
        <td className="table-element" id={request.id}>
          {request.departure_date}
        </td>
        <td className="table-element" id={request.id}>
          {request.request_type}
        </td>
        <td className="table-element" id={request.id}>
          {request.createdAt}
        </td>
        <td className="table-element" id={request.id}>
          {request.status}
          <span className={`${request.status.toLowerCase()}-dot`} />
        </td>
        <td className="table-element">
          <div className="actions-dropdown">
            <button type="button" className="drop-btn">
              Actions
            </button>
            <div className="dropdown-content">
              {request.status === "Pending" ? edit : null}
              <a href="#">View more</a>
            </div>
          </div>
        </td>
      </tr>
    ));
    return (
      <>
        <HomeNav user={user} />
        <SideBar />
        <div className="page-info">
          <h1 className="page-title">My Requests</h1>
          <h4 className="sub-title">
            {" "}
            <span className="sub-title-info">
              <a href="#">Dashboard </a>
            </span>
            /
            <span className="sub-title-info">
              <a href="#"> My Requests</a>
            </span>
          </h4>
        </div>
        <Table
          columns={columns}
          elements={elements}
          postsPerPage={this.state.postsPerPage}
          totalPosts={requests.length}
          paginate={paginate}
          currentPageNumber={this.state.currentPage}
        />
        <Footer />
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  requests: state.Requests,
  errors: state.errors,
  user: state.profile.user,
});
export default connect(mapStateToProps, { getUserRequests, retrieveProfile })(UserRequests);