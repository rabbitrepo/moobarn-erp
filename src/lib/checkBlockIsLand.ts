import supabase from 'supabase'

async function checkBlockIsLand(block_id_param) {
    try {
        let { data: blockIsLand, error } = await supabase
        .rpc('check_block_is_land', {
            block_id_param
        })
        const { message } = blockIsLand
        if (error) {
            alert(JSON.stringify(error))
            return console.log("error:", error)
        } else {
            return message;
        }
    } catch (error) {
        alert(JSON.stringify(error))
        return console.log("error:", error)
    }
}

export default checkBlockIsLand