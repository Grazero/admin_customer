<script setup>

import { ref, onMounted,computed } from 'vue'
import { setToken, getToken, removeToken, hasToken } from './utils/auth'
import axios from 'axios'

import button_blue from './components/widget/button_blue.vue'
import button_yellow from './components/widget/button_yellow.vue'

import modal from './components/modal.vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



const loading = ref(false)
const error = ref(null)
const users = ref([])

const selectedUser = ref(null) 

const sortField = ref('itemid') 
const sortDirection = ref('desc') 

//const showModal = ref(false)
const viewMode = ref(false) 
const initializeToken = () => {
  const token = getToken()
  if (!token) {
    // ตั้งค่า token ตามที่กำหนดใน Swagger
    setToken('didyouknow-lekchaiyawit-bro')

  } else {

  }
}

const fetchUsers = async () => {
  loading.value = true
  error.value = null
  const token = getToken()
  console.log(token)

  try {
    const response = await axios.get(`${API_BASE_URL}/Datacustomer/getdatacustomer`, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': `${token}`
      }

    });

    console.log(response.data)

    // ✅ แก้ไขตรงนี้ - response.data มีโครงสร้าง { status, message, data }
    if (response.data && response.data.data) {
      users.value = response.data.data
    } else {
      users.value = response.data
    }

  } catch (err) {
    console.error('Error fetching users:', err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const fetchdetail_user = (user) => {
  
  selectedUser.value = user
  viewMode.value = true
  showModal.value = true
}

const sortedUsers = computed(() => {
  const sorted = [...users.value]
  
  return sorted.sort((a, b) => {
    if (sortField.value === 'itemid') {
      // เรียงตัวเลข
      return sortDirection.value === 'desc' 
        ? b.itemid - a.itemid  // มาก -> น้อย
        : a.itemid - b.itemid  // น้อย -> มาก
    } else {
      // เรียง string (ถ้ามี field อื่น)
      const aVal = a[sortField.value] || ''
      const bVal = b[sortField.value] || ''
      return sortDirection.value === 'desc' 
        ? bVal.localeCompare(aVal)
        : aVal.localeCompare(bVal)
    }
  })
})

const sort = (field) => {
  if (sortField.value === field) {
    // สลับทิศทางถ้ากด field เดิม
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    // เปลี่ยน field และตั้งค่าเริ่มต้นเป็น desc
    sortField.value = field
    sortDirection.value = 'desc'
  }
}



// ดึงข้อมูลเมื่อ component ถูก mount
onMounted(() => {
  initializeToken()
  fetchUsers()
})

const showModal = ref(false)

const openmodal = () => {
  showModal.value = true
  viewMode.value = false 
   selectedUser.value = null
}

const closemodal = () => {
  showModal.value = false
  viewMode.value = false 
  selectedUser.value = null
}


const format_date = (data) => {
  if (data == null) return '-'
  let date_format = new Date(data);
  let date = date_format.getDate();
  let month = date_format.getMonth() + 1;
  let year = date_format.getFullYear();
  return `${date}/${month}/${year}`
}


</script>
<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
<template>

  <div v-if="loading" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-8 rounded-lg shadow-lg text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <p class="text-gray-700">กำลังโหลดข้อมูล...</p>
    </div>
  </div>

  <!-- Error Message -->
  <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
    <strong>ข้อผิดพลาด:</strong> {{ error }}
    <button @click="fetchUsers" class="ml-4 bg-red-500 text-white px-3 py-1 rounded text-sm">
      ลองใหม่
    </button>
  </div>


  <div class="container mx-auto p-4">
    <div class="text-center">
      <strong class="text-black-500 ">ข้อมูลลูกค้า</strong>
    </div>
    <div class="flex justify-end">

      <button_blue msg="เพิ่มข้อมูลลูกค้า" @click="openmodal()">

      </button_blue>

    </div>

    <modal 
      :txt_header="viewMode ? 'ดูข้อมูลลูกค้า' : 'เพิ่มข้อมูลลูกค้า'" 
      :view-mode="viewMode"
      v-if="showModal" 
      :user-data="selectedUser"
      @close="closemodal()"
      @refresh="fetchUsers"
    ></modal>

    <div class="my-2 w-full overflow-x-auto">
      <table class="w-full text-sm text-left  shadow-lg rounded-lg overflow-hidden">
        <thead class="text-xs  uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th   @click="sort('itemid')" scope="col" class="px-6 py-3 cursor-pointer hover:bg-gray-100">
              <div class="flex items-center">
                รหัส
                <span v-if="sortField === 'itemid'" class="ml-1">
                  {{ sortDirection === 'desc' ? '▼' : '▲' }}
                </span>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">ชื่อ - นามสกุล</th>
            <th scope="col" class="px-6 py-3">ที่อยู่</th>
            <th scope="col" class="px-6 py-3">วันเกิด</th>
            <th scope="col" class="px-6 py-3">อายุ</th>
            <th scope="col" class="px-6 py-3">ดู</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="user in sortedUsers" :key="user.itemid"
            class="bg-white border-b hover:bg-gray-50 transition duration-150">
            <td class="px-6 py-4 font-medium  whitespace-nowrap">{{ user.itemid || '-' }}</td>
            <td class="px-6 py-4">{{ user.firstname + " " + user.lastname }}</td>
            <td class="px-6 py-4">{{ user.address +" "+ user.district_th +" "+ user.city_th +" "+ user.province_th +""+ user.zipcode || '-' }}</td>
            <td class="px-6 py-4">{{ format_date(user.birthday) }}</td>
            <td class="px-6 py-4">{{ user.age || '-' }}</td>
            <td class="px-6 py-4">

              <button_yellow msg="ดู" @click="fetchdetail_user(user)">
              </button_yellow>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


  </div>

</template>
