
<script setup>
import button_custom from './components/button.vue';

import { ref } from 'vue'

// ข้อมูล JSON ตัวอย่าง (ในอนาคตจะเปลี่ยนเป็น API Call)
const users = ref([
  {
    "itemid": 1,
    "firstname": "ชัยยา",
    "lastname": "ชัยจำปา",
    "address": "วัดสายตาประกรอบแว่น",
    "birthday": "2000-10-19",
    "age": 25
  },
  // เพิ่มข้อมูลอื่น ๆ ที่นี่
])

const format_date =(data)=>{
    let date_format = new Date(data);
    let date = date_format.getDate();
    let month = date_format.getMonth() + 1;
    let year = date_format.getFullYear();
    return `${date}/${month}/${year}`
}

</script>

<template>
  <div class="container mx-auto p-4">
    <div class="text-center">
      <span class="text-red-500 ">ข้อมูลลูกค้า</span>
    </div>
    <div class="flex justify-end">
      <button_custom bg_color="blue"  range_color="500" msg="เพิ่ม" txt_color="white"  >

      </button_custom> 

    </div>
 

      <div class="my-2">
        <table class="w-full text-sm text-left  shadow-lg rounded-lg overflow-hidden">
          <thead class="text-xs  uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th scope="col" class="px-6 py-3">รหัส</th>
              <th scope="col" class="px-6 py-3">ชื่อ - นามสกุล</th>
              <th scope="col" class="px-6 py-3">ที่อยู่</th>
              <th scope="col" class="px-6 py-3">วันเกิด</th>
              <th scope="col" class="px-6 py-3">อายุ</th>
              <th scope="col" class="px-6 py-3">ดู</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in users" :key="user.itemid"
              class="bg-white border-b hover:bg-gray-50 transition duration-150">
              <td class="px-6 py-4 font-medium  whitespace-nowrap">{{ user.itemid }}</td>
              <td class="px-6 py-4">{{ user.firstname +" "+ user.lastname }}</td>
              <td class="px-6 py-4">{{ user.address }}</td>
              <td class="px-6 py-4">{{ format_date(user.birthday) }}</td>
              <td class="px-6 py-4">{{ user.age }}</td>
              <td class="px-6 py-4">
                <button_custom bg_color="sky"  range_color="500" msg="ดู" txt_color="white"  >
                </button_custom>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


  </div>

</template>


