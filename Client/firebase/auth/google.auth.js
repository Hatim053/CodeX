import { GoogleAuthProvider , getAdditionalUserInfo, getAuth , signInWithPopup } from 'firebase/auth';

const auth = getAuth();

const provider = new GoogleAuthProvider();

async function authenticateUserWithGoogle() {
    try {
        const response = await signInWithPopup(auth , provider);
        const credential = GoogleAuthProvider.credentialFromResult(response);
        const token = credential.accessToken;
        // signedin user info
        const user = response.user;
        console.log('user singed in successfully using google account'  , token , user , 'addittional info' , getAdditionalUserInfo(response));

    } catch (error) {
       const errorCode = error.code;
       const errorMessage = error.message;
       // email that was used by user
       const email = error.customData.email;
       const credential = GoogleAuthProvider.credentialFromError(error);
       console.log('something went wrong' , errorCode , errorMessage , email , credential)      
    }
}


export {
    authenticateUserWithGoogle,
}
