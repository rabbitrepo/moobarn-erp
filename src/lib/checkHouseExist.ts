import supabase from 'supabase'

async function checkHouseExist(address_param) {
    let { data: houseExist, error } = await supabase
        .rpc('check_house_exist', {
            address_param
        })
    const { message } = houseExist
    if (error) { alert(error) } else {
        return message
    }
}

export default checkHouseExist