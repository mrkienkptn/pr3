import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import FoundUser from '../../components/FoundUser'
import { gql, useMutation } from '@apollo/client'

const SEARCH_USER = gql`
    mutation SearchUser($name: String!){
        searchByName (name: $name){
            id
            name
        }
    }
`
const GET_CONTACT = gql`
    mutation GetContact($userId: String!){
        getUserContact(userId: $userId){
            contactId
            status
        }
    }
`

const SearchUser = () => {
    const [searchVal, setSearchVal] = useState('')
    const [foundUsers, setFoundUsers] = useState([])
    const [SearchUser, d] = useMutation(SEARCH_USER)
    const [GetContact, e] = useMutation(GET_CONTACT)

    const onChangeValue = (e) => {
        console.log(e.target.value)
        let value = e.target.value
        setSearchVal(value)
        if (value === '') {
            setFoundUsers([])
        }
    }
    const onPressSearch = async (e) => {
        const myId = localStorage.getItem("id")
        function getOnlyOtherUser(user) {
            return user.id !== myId
        }

        if (e.which === 13) {
            
            if (searchVal === '') return
            let userFound = await SearchUser({ variables: { name: searchVal } })
            let users = userFound.data.searchByName.filter(getOnlyOtherUser)
       
            let contactFound = await GetContact({variables: {userId: myId}}) 
            let contacts = contactFound.data.getUserContact

            let acceptContact = contacts.filter((con)=>{return con.status===true}).map((con)=>con.contactId)
            let pendingContact = contacts.filter((con)=>{return con.status===false}).map((con)=>con.contactId) //return id array

            users.map((u, index) => {
                if (pendingContact.includes(u.id)){
                    users[index].status = "pending"
                }else if(acceptContact.includes(u.id)){
                    users[index].status = "accept"
                }else {
                    users[index].status = "none"
                }
            })

            // console.log(users)
            setFoundUsers(users)


        }
    }
    return (
        <div className="search-user">
            <div className="search-message">
                <SearchIcon />
                <input placeholder="Seacrh people..." value={searchVal} onChange={onChangeValue} onKeyPress={onPressSearch} />
            </div>
            <div>
                {foundUsers !== undefined && foundUsers !== [] && foundUsers.map(({ id, name, status }, indx) => (
                    <FoundUser contactId={id} name={name} key={indx} status={status} />
                ))}
            </div>
        </div>
    );
}

export default SearchUser;
