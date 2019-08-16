import * as firebase from 'firebase'
import swal from 'sweetalert';
import iziToast from 'izitoast/dist/js/iziToast.min.js';
import Swal from 'sweetalert2';
import { saveAccount } from './firebaseDatabase.js'

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

iziToast.settings({
	progressBar: false
});

export const signinWithGoogle = () => {
	return new Promise((resolve, reject)=>{
		firebase.auth().signInWithPopup(provider).then(function (result) {
			resolve(result);
		}).catch(function (error) {
			reject(error);
		});
	})
}
export const handleSignUp = (email, password, firstName, lastName, confirmPass, toggleLoading) => {
	// console.log(this.state)
	
	if (email.indexOf('kmutnb.ac.th') === -1) {
		swal('ระวัง!', 'กรุณาใช้อีเมล์ของมหาวิทยาลัย ที่ลงท้ายด้วย kmutnb.ac.th', 'warning');
		iziToast.warning({
			title: 'ระวัง!',
			message: 'กรุณาใช้อีเมล์ของมหาวิทยาลัย ที่ลงท้ายด้วย kmutnb.ac.th',
		});
		toggleLoading(false);
		return;
	}
	if (password.length < 6) {
		swal('ระวัง!', 'กรุณากรอกพาสเวิร์สมากกว่า 6 หลัก', 'warning');
		iziToast.warning({
			title: 'ระวัง!',
			message: 'กรุณากรอกพาสเวิร์สมากกว่า 6 หลัก',
		});
		toggleLoading(false);
		return;
	}
	if (password !== confirmPass) {
		swal('ระวัง!', 'กรุณากรอกพาสเวิร์สให้ตรงกัน นนน', 'warning');
		iziToast.warning({
			title: 'ระวัง!',
			message: 'กรุณากรอกพาสเวิร์สให้ตรงกัน',
		});
		toggleLoading(false);
		return;
	}
	firebase.auth().createUserWithEmailAndPassword(email, password).then((sendEmailVerify) => {
		console.log("===>>"+sendEmailVerify)
		if (sendEmailVerify) {
			saveAccount(email,firstName,lastName);
			console.log(sendEmailVerify)
			if (sendEmailVerify === false) {
				toggleLoading(false);
				return false;
			} else {
				console.log(firstName + " fN")
				console.log(lastName + " lN")
				firebase.auth().currentUser.sendEmailVerification()
				Swal.fire({
					type: 'success',
					title: 'สำเร็จ!',
					text: 'ลงทะเบียนเรียบร้อย! กรุณายืนยันอีเมลก่อนทำการลงชื่อเข้าใช้',
					animation: true
				  }).then(() => {
					// window.location.reload();
					firebase.auth().signOut();
					window.location.assign('/login');
					
				  })
				// swal('สำเร็จ!', 'ลงทะเบียนเรียบร้อย! กรุณายืนยันอีเมลก่อนทำการลงชื่อเข้าใช้', 'success');
				iziToast.success({
					title: 'สำเร็จ!',
					message: 'ลงทะเบียนเรียบร้อย! กรุณายืนยันอีเมลก่อนทำการลงชื่อเข้าใช้',
				});
				toggleLoading(false);
				return true;
			}
		}
	}).catch((error) => {
		const errorCode = error.code
		const errorMessage = error.message
		if (errorCode === 'auth/weak-password') {
			swal('ระวัง!', 'พาสเวิร์สคาดเดาง่ายเกินไป', 'warning');
			iziToast.warning({
				title: 'ระวัง!',
				message: 'พาสเวิร์สคาดเดาง่ายเกินไป',
			});
			toggleLoading(false);
			// console.log(errorCode)
		} else if(errorCode === 'auth/email-already-in-use'){
			swal('มี email นี้อยู่แล้ว!', 'กรุณาลองใหม่ภายหลัง', 'error');
			console.log("มีอีเมลนี้แล้ว")
			// console.log("errorMessage = "+errorMessage)
			iziToast.error({
				title: 'มี email นี้อยู่แล้ว!',
				message: 'มี email นี้อยู่แล้วกรุณาลองใหม่ภายหลัง',
			});
			toggleLoading(false);
		} 
		return;
		// console.log(error)
	});
}

export const toggleSignIn =  function(email, password){
	console.log("toggleSignin")
	return new Promise((resolve, reject)=>{
		if (firebase.auth().currentUser) {
			console.log(firebase.auth().currentUser)
			firebase.auth().signOut();
			// continue;
		}else {
			console.log("else toggleSignin")
			if (email.length < 4) {
				swal('ระวัง!', 'กรุณากรอกอีเมลแอดเดรส', 'warning');
				iziToast.warning({
					title: 'ระวัง!',
					message: 'กรุณากรอกอีเมลแอดเดรส',
				});
				reject()
			}
			if (password.length < 6) {
				swal('ระวัง!', 'กรุณากรอกพาสเวิร์ส', 'warning');
				iziToast.warning({
					title: 'ระวัง!',
					message: 'กรุณากรอกพาสเวิร์ส',
				});
				reject()
			}
			firebase.auth().signInWithEmailAndPassword(email, password)
				.catch((error) => {
					console.log("error toggleSignin")
					const errorCode = error.code;
					const errorMessage = error.message;
					if (errorCode === 'auth/wrong-password') {
						swal('ผิดพลาด!', 'ท่านกรอกรหัสผ่านผิด', 'error');
						iziToast.error({
							title: 'ผิดพลาด!',
							message: 'ท่านกรอกรหัสผ่านผิด',
						});
						console.log(errorCode)
						reject(1)

					} else {
						swal('ระวัง!', errorMessage, 'warning');
						iziToast.warning({
							title: 'ระวัง!',
							message: errorMessage,
						});
						reject(2)
					}
				}).then((checkVerify) => {
					console.log("then toggleSignin")
					const user = firebase.auth().currentUser
					firebase.auth().onAuthStateChanged(firebaseUser => {
						if (firebaseUser) {
							console.log(firebaseUser)
							if (firebaseUser.emailVerified) {
								console.log('Email is verified')
								if (user != null) {
									const name = user.displayName
									const email = user.email
									const photoUrl = user.photoURL
									const emailVerified = user.emailVerified
									const uid = user.uid
									resolve()
								}
							} else {
								console.log('Email is not verified')
								Swal.fire({
									type: 'warning',
									title: 'ไม่สามารถเข้าสู่ระบบได้!',
									text: 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ',
									animation: true
								  }).then(() => {
									// window.location.reload();
									  firebase.auth().signOut();
									  window.location.assign('/login');
								  })
								// swal('ไม่สามารถเข้าสู่ระบบได้!', 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ', 'error');
								iziToast.error({
									title: 'ไม่สามารถเข้าสู่ระบบได้!',
									message: 'กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ',
								});

								reject()
							}
						}
					})
				});
		}
	})
}

export const retrieveID = () =>{
	firebase.auth().currentUser.getIdToken(true).then((idToken)=>{
		console.log(idToken)
	}).catch((error)=>{
		console.log(error)
	})
}

export const toggleSignOut= () =>{
	if (firebase.auth().currentUser) {
		firebase.auth().signOut();
		swal('สำเร็จ!', 'ลงทะเบียนออกสำเร็จ', 'success');
		iziToast.success({
			title: 'สำเร็จ!',
			message: 'ลงทะเบียนออกสำเร็จ',
		});
	}
}

export const forgotPassword = (email) => {
	firebase.auth().sendPasswordResetEmail(email).then(() => {
		swal('สำเร็จ!', 'กรุณาตรวจสอบอีเมลของท่าน', 'success');
		iziToast.success({
			title: 'สำเร็จ!',
			message: 'กรุณาตรวจสอบอีเมลของท่าน',
		});
	}).catch((error) => {
		const errorCode = error.code
		const errorMessage = error.message
		if (errorCode === 'auth/invalid-email') {
			swal('ผิดพลาด!', 'ท่านกรอกอีเมลผิด', 'error');
			iziToast.error({
				title: 'ผิดพลาด!',
				message: 'ท่านกรอกอีเมลผิด',
			});
		} else if (errorCode === 'auth/user-not-found') {
			swal('ผิดพลาด!', 'ไม่พบผู้ใช้ในระบบ', 'error');
			iziToast.error({
				title: 'ผิดพลาด!',
				message: 'ไม่พบผู้ใช้ในระบบ',
			});
		}
		console.log(error)
	})
}

export const getCurrentUser =() => {
	return new Promise((resolve,reject) => {
		firebase.auth().onAuthStateChanged(firebaseUser => {
			if (firebaseUser) {
				resolve(firebaseUser);
			}
			else{
				reject();
			}
		})
	})
}


