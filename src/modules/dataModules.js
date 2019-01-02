export default Object.create(null, {

  emailAndUsernameValidation: {
    value: function (email) {
      return /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)
    }
  },

  stateOpts: {
    value: function () {
      let stateOpts = [{ title: "Alabama - AL", value: "AL" }, { title: "Alaska - AK", value: "AK" }, { title: "Arizona - AZ", value: "AZ" }, { title: "Arkansas - AR", value: "AR" }, { title: "California - CA", value: "CA" }, { title: "Colorado - CO", value: "CO" }, { title: "Connecticut - CT", value: "CT" }, { title: "Delaware - DE", value: "DE" }, { title: "Florida - FL", value: "FL" }, { title: "Georgia - GA", value: "GA" }, { title: "Hawaii - HI", value: "HI" }, { title: "Idaho - ID", value: "ID" }, { title: "Illinois - IL", value: "IL" }, { title: "Indiana - IN", value: "IN" }, { title: "Iowa - IA", value: "IA" }, { title: "Kansas - KS", value: "KS" }, { title: "Kentucky - KY", value: "KY" }, { title: "Louisiana - LA", value: "LA" }, { title: "Maine - ME", value: "ME" }, { title: "Maryland - MD", value: "MD" }, { title: "Massachusetts - MA", value: "MA" }, { title: "Michigan - MI", value: "MI" }, { title: "Minnesota - MN", value: "MN" }, { title: "Mississippi - MS", value: "MS" }, { title: "Missouri - MO", value: "MD" }, { title: "Montana - MT", value: "MT" }, { title: "Nebraska - NE", value: "NE" }, { title: "Nevada - NV", value: "NV" }, { title: "New Hampshire - NH", value: "NH" }, { title: "New Jersey - NJ", value: "NJ" }, { title: "ANew Mexico - NM", value: "NM" }, { title: "New York - NY", value: "NY" }, { title: "North Carolina - NC", value: "NC" }, { title: "North Dakota - ND", value: "ND" }, { title: "Ohio - OH", value: "OH" }, { title: "Oklahoma - OK", value: "OK" }, { title: "Oregon - OR", value: "OR" }, { title: "Pennsylvania - PA", value: "PA" }, { title: "Rhode Island - RI", value: "RI" }, { title: "South Carolina - SC", value: "SC" }, { title: "South Dakota - SD", value: "SD" }, { title: "Tennessee - TN", value: "TN" }, { title: " Texas - TX", value: "TX" }, { title: "Utah - UT", value: "UT" }, { title: "Vermont - VT", value: "VT" }, { title: "Virginia - VA", value: "VA" }, { title: "Washington - WA", value: "WA" }, { title: "West Virginia - WV", value: "WV" }, { title: "Wisconsin - WI", value: "WI" }, { title: "Wyoming - WY", value: "WY" }]
      return stateOpts;
    }
  },

  makeRandomId: {
    value: function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 26; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
      }
    }
})

