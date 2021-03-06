import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logout, update } from '../actions/userActions';
import { useDispatch, useSelector } from 'react-redux';
import { listMyOrders } from '../actions/orderActions';
import axios from 'axios';

function ProfileScreen(props) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [image, setImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const dispatch = useDispatch();

    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    const handleLogout = () => {
        dispatch(logout());
        props.history.push("/signin");
    }

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(update({ userId: userInfo._id, email, name, password, image, address, contactNumber }));
    }

    const uploadFileHandler = (e) => {
        const file = e.target.files[0];
        const bodyFormData = new FormData();
        bodyFormData.append('image', file);
        setUploading(true);
        axios.post("/api/uploads", bodyFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        })
        .then((response) => {
          setImage(response.data);
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setUploading(false);
        });
    };

    const userUpdate = useSelector(state => state.userUpdate);
    const { loading, success, error } = userUpdate;

    const myOrderList = useSelector(state => state.myOrderList);
    const { loading: loadingOrders, orders, error: errorOrders } = myOrderList;

    useEffect(() => {
        if (userInfo) {
            console.log(userInfo.name)
            setEmail(userInfo.email);
            setName(userInfo.name);
            setPassword(userInfo.password);
            setImage(userInfo.image);
            setAddress(userInfo.address);
            setContactNumber(userInfo.contactNumber);
        }
        dispatch(listMyOrders());
        return () => {

        };
    }, [userInfo])

    return <div className="profile">
        <div className="profile-info">
            <div className="form">
                <form onSubmit={submitHandler}>
                    <ul className="form-container">
                        <li>
                            <h2>User Profile</h2>
                        </li>
                        <li>
                            {loading && <div>Loading...</div>}
                            {error && <div>{error}</div>}
                            {success && <div>Profile Saved Successfully.</div>}
                        </li>
                        <li>
                            <div className="profile-image">
                                <img 
                                    src={image}
                                    alt="profile"    
                                />
                            </div>
                        </li>
                        <li>
                            <label htmlFor="name">
                                Name
                            </label>
                            <input 
                                value={name} 
                                type="name" 
                                name="name" 
                                id="name" 
                                onChange={(e) => setName(e.target.value)}>

                            </input>
                        </li>
                        <li>
                            <label htmlFor="email">
                                Email
                            </label>
                            <input 
                                value={email} 
                                type="email" 
                                name="email" 
                                id="email" 
                                onChange={(e) => setEmail(e.target.value)}>

                            </input>
                        </li>
                        <li>
                            <label htmlFor="password">
                                Password
                            </label>
                            <input 
                                value={password} 
                                type="password" 
                                name="password" 
                                id="password" 
                                onChange={(e) => setPassword(e.target.value)}>

                            </input>
                        </li>
                        <li>
                            <label htmlFor="image">Image</label>
                            <input
                                value={image}
                                type="text"
                                name="image"
                                value={image}
                                id="image"
                                onChange={(e) => setImage(e.target.value)}>
                            </input>
                            <input type="file" onChange={uploadFileHandler}></input>
                            {uploading && <div>Uploading...</div>}
                        </li>
                        <li>
                            <label htmlFor="address">
                                Address
                            </label>
                            <input 
                                value={address}
                                type="text" 
                                name="address" 
                                id="address" 
                                onChange={(e) => setAddress(e.target.value)}>
                            </input>
                        </li>
                        <li>
                            <label htmlFor="address">
                                Contact Number
                            </label>
                            <input 
                                value={contactNumber}
                                type="text" 
                                name="contactNumber" 
                                id="contactNumber" 
                                onChange={(e) => setContactNumber(e.target.value)}>
                            </input>
                        </li>
                        <li>
                            <button type="submit" className="button primary">Update</button>
                        </li>
                        <li>
                            <button type="button" onClick={handleLogout} className="button secondary full-width">Logout</button>
                        </li>
                    </ul>
                </form>
            </div>
        </div>
        <div className="profile-orders content-margined">
            {
                loadingOrders ? <div>Loading...</div> :
                    errorOrders ? <div>{errorOrders}</div> :
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>DATE</th>
                                    <th>TOTAL</th>
                                    <th>PAID</th>
                                    <th>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.createdAt}</td>
                                    <td>{order.totalPrice}</td>
                                    <td>{order.isPaid.toString()}</td>
                                    <td>
                                        <Link to={"/order/" + order._id}>DETAILS</Link>
                                    </td>
                                </tr>)}
                            </tbody>
                        </table>

            }
        </div>
    </div>

}

export default ProfileScreen;