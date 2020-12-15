import React,{useState} from 'react'
import SearchIcon from '@material-ui/icons/Search'
import {useQuery, gql, useMutation} from '@apollo/client'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import './FoundUser.css'

const JOIN_GROUP = gql`
    mutation JoinGroup($userId: String!, $code: String!) {
        joinGroup(userId: $userId, code: $code) {
            status
        }
    }
`

const ModalJoinGroup = () => {
    const classes = useStyles();
    const currentUserId = localStorage.getItem('id')
    const [codeGroup, setCodeGroup] = useState('')
    const [joinGroup, result] = useMutation(JOIN_GROUP)
    const [notifyCodeGroup, setNotifyCodeGroup] = useState('')

    const onChangeValue = (e) => {
        setCodeGroup(e.target.value)
    }

    const onClickJoinGroup = (e) => {
        e.preventDefault()
        if (codeGroup !== '') {
            joinGroup({
                variables: {userId: currentUserId, code: codeGroup}
            })
            .then(res => {
                if (res.data.joinGroup.status === 'success') {
                    global.chatSocket.emit('join-group', {status: true})
                    setCodeGroup('')
                    setNotifyCodeGroup("Join group success")
                } else if (res.data.joinGroup.status === 'group-not-found'){
                    setCodeGroup('')
                    setNotifyCodeGroup('Group not found')
                } else if (res.data.joinGroup.status === 'exists') {
                    setCodeGroup('')
                    setNotifyCodeGroup('You are already in the group')
                }
            })
            .catch(err => {
                setCodeGroup('')
                setNotifyCodeGroup(err)
            })
        } else {
            setNotifyCodeGroup('You have not entered code group')
        }
    }


    return (
        <div className="modal-dialog" role="document">
            <div className="modal-content" style={{width:'700px', height: '500px'}}>
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Join Group</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div className="modal-body">
                    <div className="row" style={{marginLeft: '120px'}}>
                        <div className="search-message w-50">
                            <SearchIcon />
                            <input placeholder="Enter code group..." onChange={onChangeValue} value={codeGroup}/>
                        </div>
                        <div className="w-20">
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                className={classes.button}
                                onClick={onClickJoinGroup}
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                    <div className="row" style={{marginLeft: '150px'}}>
                        <p className="text-center font-weight-bold mt-2">{notifyCodeGroup}</p>
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

export default ModalJoinGroup