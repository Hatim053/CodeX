import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword , validatePassword , signOut } from 'firebase/auth';


const auth = getAuth();


async function signupUserWithEmailAndPassword(email , password) {
try {
    const userCredential = await createUserWithEmailAndPassword(auth , email , password);
    // user signed up successfully 
    const user = userCredential.user;
    console.log(user);
} catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log('something went wrong' , errorCode , errorMessage);
}
}


async function loginWithEmailAndPassword(email , password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth , email , password);
        // user signed in successfully
        const user = userCredential.user;
        console.log(user);
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('something went wrong' , errorCode , errorMessage);
    }
}


async function isPasswordValid(passwordFromUser) {
    const status = await validatePassword(auth , passwordFromUser);
    if(!status.isValid) {
        // incorrect password
        console.log(status)
    }
}

async function signOutUser() {
    try {
        const  response = await signOut(auth);
        console.log(response)
        // signOut successfully
    } catch (error) {
        console.log('signOut failed' , error)
    }
}


export {
    signupUserWithEmailAndPassword,
    loginWithEmailAndPassword,
    isPasswordValid,
    signOutUser,
}





