<template>
  <client-only>
    <div id="bracket" style="cursor:pointer"></div>
  </client-only>
</template>

<script>
import axios from "axios";
export default {
  props: {
    playoffData: Object,
    eventId: String,
    isAdmin: Boolean
  },
  mounted() {
    let isAdmin = false;
    let auth;
    if (process.browser) {
     this.$aes.setKey("SECURE_VAL_PW");
      var authEnc = localStorage.getItem("auth");
        if (authEnc) {
        auth = JSON.parse(this.$aes.decrypt(authEnc));
      if (auth && auth.permissions.indexOf("admin") != -1) {
        isAdmin = true;
      }
    }
    }
    let saveData = this.playoffData;
    let event_id = this.eventId;

    function saveFn(data, userData) {
      $("#saveOutput").text("POST " + userData + " " + data);
      let apiData = {
        playoffs: data
      };
      axios('https://macvars.herokuapp.com/' + `api/events/${event_id}`, {
        method: "patch",
        data: apiData,
        headers:{
           "Authorization": `Bearer ${auth.accessToken}`
        }
      })
        .then(function(response) {
          return response.data;
        })
        .then(response => {});
    }
    function onclick(data) {
      if (data === undefined) {
        return;
      }
    }

    let bracketData = {
      init: saveData,
      teamWidth: 120,
      skipConsolationRound: true
    };

    if (isAdmin) {
      bracketData.save = saveFn;
    }

    if (!isAdmin) {
      bracketData.onMatchClick = onclick;
    }

    $(function() {
      var container = $("#bracket");
      container.bracket(bracketData);

      /* You can also inquiry the current data */
      var data = container.bracket("data");
      $("#dataOutput").text(data);
    });
  }
};
</script>

<style>
div.jQBracket .team.lose {
  background-color: #171e29;
}
div.jQBracket .team.lose div.label {
  opacity: 0.6;
}
div.jQBracket .team.lose div.score {
  background-color: #7e1e00;
  color: white;
}

div.jQBracket .team.win div.score {
  background-color: #007e37;
  color: white;
}
div.jQBracket .team.win {
  background-color: #171e29;
  color: #000;
}
div.jQBracket .team {
  background-color: #171e29;
}
</style>