let csc = require('country-state-city').default


var districts = []
module.exports = {
    states: () => {
        return new Promise((resolve, reject) => {
            states = csc.getStatesOfCountry("IN");
            let stateName = new Array();
            for (i = 0; i <= states.length - 1; i++) {
                let names = {
                    name: states[i].name,
                    code: states[i].isoCode
                };
                stateName.push(names);
            }
            resolve(stateName);
        })
    },
    districts: (statecode) => {
        return new Promise((resolve, reject) => {
            district = csc.getCitiesOfState("IN", statecode);
            districts = []
            for (i = 0; i <= district.length - 1; i++) {
                names = district[i].name
                districts.push(names)
            }
            resolve();
        })

    },
    districtNames: () => {
        return districts
    }

}