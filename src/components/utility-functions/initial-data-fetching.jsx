import React from "react";
import axios from "axios";

const InitialDataFetching = ({ source, setData }) => {
    if (source === "dashboard") {
        axios
            .get(`http://localhost:3001/api/appointments`)
            .then((response) => {
                const formattedData = response.data.map(item => ({
                    ...item,
                    name: item.name || '',
                    email: item.email || '',
                    phone: item.phone || '',
                    appointmentDate: item.appointmentDate || '',
                    appointmentTime: item.appointmentTime || '',
                    source: item.source || 'Direct'
                }));
                setData(formattedData);
            })
            .catch((error) => {
                console.error(error);
            });
    }
};

export default InitialDataFetching;
