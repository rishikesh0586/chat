import React, { useState,useEffect } from "react";
import Add from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link} from "react-router-dom";

const Register = () => {
  const [err, setErr] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();
  //const history = useHistory();

  const handleSubmit = async (e) => {
    
    setLoading(true);
    setClicked(true);
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            setUserDataLoaded(true);
          } catch (err) {
            console.log(err);
            setErr(true);
            setLoading(false);
          }
        });

      });
    } catch (err) {
      setErr(true);
      setLoading(false);
    }

    
  };
  useEffect(() => {
    if (userDataLoaded) {
      navigate("/", { replace: true });
    }
  }, [userDataLoaded, navigate]);
  const buttonStyle = {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: clicked ? '#61dafb' : '#4caf50',
    color: clicked ? '#fff' : '#000',
  };
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Peter Chat</span>
        <span className="title">Register</span>
        <form  onSubmit={handleSubmit} >
        
          <input required type="text" placeholder="display name" />
          <input required type="email" placeholder="email" />
          <input required type="password" placeholder="password" />
          <input required style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button disabled={loading} 
      style={buttonStyle}>Sign up</button>
          {loading && "Uploading and compressing the image please wait..."}
          {err && <span>Something went wrong</span>}
        </form>
        <p>
           have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
