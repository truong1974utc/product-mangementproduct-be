module.exports = (query) => {
    let filterStatus = [
        {
            name: "Tat Ca",
            status: "",
            class: ""
        },
        {
            name: "Hoat Dong",
            status: "active",
            class: ""
        },
        {
            name: "Dung Hoat Dong",
            status: "inactive",
            class: ""
        }
    ]

    if(query.status) {
        const index = filterStatus.findIndex(item => item.status == query.status)
        filterStatus[index].class = "active"
    }else {
        const index = filterStatus.findIndex(item => item.status == "")
        filterStatus[index].class = "active"
    }

    return filterStatus
}