import React,{useState} from 'react'
import SearchIcon from '@material-ui/icons/Search'
// import FindUserAddGroup from './FindUserAddGroup'
import {useQuery, gql, useMutation} from '@apollo/client'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import './FoundUser.css'

const CREATE_GROUP = gql`
    mutation CreateGroup($idRole: String!, $roomName: String!) {
        createGroup(idRole: $idRole, roomName: $roomName) {
            id
            name
            admin
            code
        }
    }
`

const ModalAddUserToGroup = () => {

    const classes = useStyles();
    const currentUserId = localStorage.getItem('id')
    const [groupName, setGroupName] = useState('')
    const [notifyCreateGroup, setNotifyCreateGroup] = useState('')
    const [createGroup, result] = useMutation(CREATE_GROUP)

    const onChangeValue = (e) => {
        setGroupName(e.target.value)
    }

    const onClickCreateGroup = (e) => {
        e.preventDefault()
        if (groupName !== '') {
            createGroup({
                variables: {idRole: currentUserId, roomName: groupName}
            })
            .then(res => {
                global.chatSocket.emit('create-new-group', {status: true})
                setNotifyCreateGroup('Create group success')
                setGroupName('')
            })
            .catch(err => {
                setNotifyCreateGroup(err)
            })
        } else {
            setNotifyCreateGroup('You have not entered group name')
        }
    }

    return (
        <div className="modal-dialog" role="document">
            <div className="modal-content" style={{width:'700px', height: '500px'}}>
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Create Group</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="row" style={{marginLeft: '120px'}}>
                        <div className="search-message w-50">
                            <SearchIcon />
                            <input placeholder="Enter group name..." onChange={onChangeValue} value={groupName}/>
                        </div>
                        <div className="w-20">
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.button}
                                onClick={onClickCreateGroup}
                            >
                                Continue
                            </Button>
                        </div>
                        <div className="row" style={{marginLeft: '60px'}}>
                            <p className="text-center font-weight-bold mt-2">{notifyCreateGroup}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
        textTransform: 'capitalize',
        height: 35,
        marginRight: 20
    },
}));

export default ModalAddUserToGroup