import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { GET_DOCTOR_LIST } from "../../API/ApiHandler";
import demoImg from "../../assets/images/doc.png";
import axios from "axios";

// Skeleton loader component
const SkeletonLoader = () => (
  <View style={styles.card}>
    <View style={styles.imageContainer}>
      <View style={[styles.skeletonImage, { borderRadius: 10 }]} />
    </View>
    <View style={styles.doctorInfo}>
      <View style={[styles.skeletonText, { width: "70%", marginBottom: 6 }]} />
      <View style={[styles.skeletonText, { width: "50%" }]} />
    </View>
  </View>
);

const DoctorCard = ({ doctor, onPress }) => {
  const specialityNames = doctor.specialities.map(
    (speciality) => speciality.name
  );

  return (
    <TouchableOpacity onPress={() => onPress(doctor)}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          {doctor?.image ? (
            <Image
              source={{ uri: `data:image/png;base64,${doctor.image}` }}
              style={styles.doctorImage}
            />
          ) : (
            <Image source={demoImg} style={styles.doctorImage} />
          )}
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>
            {specialityNames.join(", ")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const DoctorList = () => {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleDoctorList();
  }, []);

  async function handleDoctorList() {
    try {
      const response = await axios.get(
        `${GET_DOCTOR_LIST}?consultation_type_id=${2}`
      );
      setDoctors(response?.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctor list:", error);
      setLoading(false);
    }
  }

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    const id = doctor.id;
    const name = doctor.name;
    const image = doctor.image;

    console.log(id);
    router.push({
      pathname: "/booking/Booking",
      params: {
        id,
        name,
        image,
      },
    });
  };
  function handleBackButtonPress() {
    router.back();
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/doclistbg.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackButtonPress}>
            <Image
              source={require("../../assets/images/back.png")}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Text style={styles.browseText}>Browse Doctors</Text>
        </View>
      </ImageBackground>
      <View style={styles.filters}>
        <Text style={styles.filterText}>
          Doctors near you ({doctors.length})
        </Text>
        <TouchableOpacity>
          <Text style={styles.filterButton}>Filter</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        // Show skeleton loader if loading is true
        <>
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </>
      ) : (
        <ScrollView>
          {doctors.map((doctor, index) => (
            <DoctorCard
              key={index}
              doctor={doctor}
              onPress={handleDoctorSelect}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    marginBottom: "2rem",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "contain",
    justifyContent: "center",
    width: "100%",
    maxHeight: "70%",
    minHeight: "200px",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    width: 30,
    height: 30,
    marginRight: 20,
    marginLeft: 20,
  },
  browseText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  filters: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  filterText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  filterButton: {
    fontSize: 16,
    color: "blue",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    // overflow: "hidden",
    marginRight: 10,
    zIndex: "10",
  },
  doctorImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover",
    borderRadius: 10,
    opacity: 1, // Adjust this value as needed
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  doctorSpecialty: {
    fontSize: 16,
    color: "gray",
  },
  skeletonImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E0E0E0",
  },
  skeletonText: {
    backgroundColor: "#E0E0E0",
    height: 14,
    borderRadius: 5,
  },
});

export default DoctorList;
