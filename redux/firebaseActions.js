export const syncCartFromDb = (db, dispatch, accountId) => {
    db.ref('customers/'+accountId).on('value', state => {
        console.log('state from firebase action: ', state);
        dispatch({
            type: 'SYNC_CART',
            payload: state
        })
    })
}