import React from "react";
import Container from "react-bootstrap/Container"
import DashboardTile from "./DashboardTile";
import DashboardGraph from "./DashboardGraph";
import {db} from '../services/firebase';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      teams: []
    };
  }

  componentDidMount() {
    db.collection('teams').get().then((snapshot) => {
      this.setState({ teams: snapshot.docs.map(doc => doc.data()) });
    });
    console.log(this.state.teams)
  }

  get_latest_clue = (clue_log) => {
    for (let i = clue_log.length - 1; i >=0 ; i--) {
      if (clue_log[i] != null) {
        return i;
      }
    }
    return 0;
  }
  
  render() {
    // Add current clue value to leaderboard
    var team_data = this.state.teams.map((team) => ({
      username: team.username,
      teammates: team.teammates,
      clue_log: team.clue_log,
      clue_num: this.get_latest_clue(team.clue_log)
    }));
    const graph_data = team_data.map((team) => ({
      label: team.username,
      data: team.clue_log.map((value, index) => ([value, index]) )
    }) );
    console.log(graph_data)
    // Sort Leaderboard
    team_data = team_data.sort((a, b) => (a.clue_num < b.clue_num) ? 1 : -1)
    // Create list of tiles
    const tile_list = team_data.map((team) =>
      <DashboardTile 
        team = {team} 
      />
    );
    return (
      <Container>
        <h1>Dashboard</h1>
        <h2>Leaderboard</h2>
        {tile_list}
        {/* <h2>History</h2>
        <DashboardGraph data={graph_data} /> */}
      </Container>
    );
  }
}

export default Dashboard;