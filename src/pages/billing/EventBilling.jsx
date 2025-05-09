import React, {useState} from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect } from 'react'

const EventBilling = () => {

  const { id } = useParams()
  const API_URL = import.meta.env.VITE_API_URL;

  const handleGetBilling = async () => {
    try {
      const response = await axios.get(`${API_URL}/events/prices/${id}`)
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching billing data:', error)
    }
  }
  return (
    <div>EventBilling</div>
  )
}

export default EventBilling