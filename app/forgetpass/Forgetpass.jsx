import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

const Forgotpass = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground source={require('../../assets/images/forgetbanner.png')} style={styles.backgroundImage}>
                <View style={styles.topContainer}>
                    <Text style={styles.forgotPasswordText}>FORGOT PASSWORD?</Text>
                    <Text style={styles.subText}>Then let's submit password reset.</Text>
                </View>
            </ImageBackground>
            <View style={styles.cardContainer}>
                <TouchableOpacity style={styles.card}>
                    <Image source={require('../../assets/images/mail.png')} style={styles.cardImage} />
                    <View>
                        <Text style={styles.cardText}>Send via Email</Text>
                        <Text style={styles.cardText1}>Reset password via email</Text>
                    </View>
                    <Image source={require('../../assets/images/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.card}>
                    <Image source={require('../../assets/images/lock.png')} style={styles.cardImage} />
                    <View >
                        <Text style={styles.cardText}>Send via 2FA</Text>
                        <Text style={styles.cardText1}>Reset password via 2FA</Text>
                    </View>
                    <Image source={require('../../assets/images/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.card}>
                    <Image source={require('../../assets/images/key.png')} style={styles.cardImage} />
                    <View>
                        <Text style={styles.cardText}>Send via Google Auth</Text>
                        <Text style={styles.cardText1}>Reset password via G-Auth</Text>
                    </View>
                    <Image source={require('../../assets/images/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.card}>
                    <Image source={require('../../assets/images/mobile.png')} style={styles.cardImage} />
                    <View>
                        <Text style={styles.cardText}>Send via SMS</Text>
                        <Text style={styles.cardText1}>Reset password via SMS</Text>
                    </View>
                    <Image source={require('../../assets/images/arrow.png')} style={styles.arrowIcon} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.resetButton}>
                <Text style={styles.resetButtonText}>RESET PASSWORD</Text>
                <Image source={require('../../assets/images/lock1.png')} style={styles.lockImage} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: -150,
        flex: 1,
        backgroundColor: '#FFFFFF',
        
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        
    },
    topContainer: {
        alignItems: 'left',
        marginLeft: 12,
        marginTop: 112,
        
      
    },
    forgotPasswordText: {
        color: '#FFFFFF',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'left',
    },
    subText: {
        color: '#FFFFFF',
        fontSize: 18,
        textAlign: 'left',
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    card: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        marginBottom: 15,
        padding: 15,
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'relative',
    },
    cardImage: {
        width: 50,
        height: 60,
        marginRight: 10,
    },
    cardText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    cardText1:{
        fontSize: 14,
        marginTop: 10,
        color: 'black',
        fontWeight: 'light',
    },
    resetButton: {
        backgroundColor: '#1E64FA',
        width: '90%',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    resetButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    lockImage: {
        width: 20,
        height: 24,
        tintColor: '#FFFFFF',
    },
    arrowIcon: {
        width: 20,
        height: 20,
        marginLeft: 'auto',
    },
});

export default Forgotpass;
