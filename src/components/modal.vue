<script setup>
import input_field from './widget/input.vue'
import textarea_field from './widget/textarea.vue'
import button_blue from './widget/button_blue.vue'
import button_red from './widget/button_red.vue'

import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { getToken } from '../utils/auth'

const props = defineProps({
    txt_header: String,
    viewMode: {
        type: Boolean,
        default: false
    },
    userData: {
        type: Object,
        default: null
    }
})


const selectedDate = ref('')
const selectedProvince = ref('')
const selectedAmphure = ref('')
const selectedDistrict = ref('')


const dataprovince = ref([])
const datacity = ref([])
const datadistrict = ref([])
const datazipcode = ref([])

const showModal = ref(false)

const firstname = ref('')
const lastname = ref('')
const address = ref('')

const loading = ref(false)
const showSuccessDialog = ref(false)
const type_Dialog = ref('')
const successMessage = ref('')

const emit = defineEmits(['close', 'refresh'])


const age = computed(() => {


    if (!selectedDate.value) return ''

    const birthDate = new Date(selectedDate.value)
    const today = new Date()
    let calculatedAge = today.getFullYear() - birthDate.getFullYear()

    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--
    }

    return calculatedAge
})

const loadUserDataToForm = async (userData) => {
    try {
        loading.value = true




        // ✅ โหลดข้อมูลพื้นฐาน
        firstname.value = userData.firstname || ''
        lastname.value = userData.lastname || ''
        let birthday = "";
        if (!userData.birthday) {
            selectedDate.value = ''
        } else {

            birthday = userData.birthday

        }



        selectedDate.value = birthday || ''
        address.value = userData.address || ''



        if (userData.province_id) {
            selectedProvince.value = userData.province_id

            await fetchdata_city(userData.province_id)

            if (userData.city_id) {
                selectedAmphure.value = userData.city_id
                await fetchdata_district(userData.province_id, userData.city_id)

                if (userData.district_id) {
                    selectedDistrict.value = userData.district_id
                    await fetchdata_zipcode(userData.province_id, userData.city_id, userData.district_id)
                }
            }
        }
    } catch (err) {

    } finally {
        loading.value = false
    }
}


const fetchdata_province = async () => {
    const token = getToken()

    try {
        const response = await axios.get(`${API_BASE_URL}/Datacustomer/getProvice`, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': `${getToken()}`
            }
        });

        dataprovince.value = response.data.data || []
    } catch (err) {

    }
}

const fetchdata_city = async (province_id) => {

    return new Promise(async (resolve, reject) => {

        try {
            const token = getToken()

            const response = await axios.post(`${API_BASE_URL}/Datacustomer/getCity?province_id=${province_id}`, {

            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': `${getToken()}`
                }
            }
            );

            datacity.value = response.data.data || []
            resolve();
        } catch (err) {

            resolve();
        }

    });

}

const fetchdata_district = async (province_id, city_id) => {
    try {
        const token = getToken()

        loading.value = true
        const response = await axios.post(`${API_BASE_URL}/Datacustomer/getDistrict?province_id=${province_id}&city_id=${city_id}`, {

        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': `${getToken()}`
            }
        }
        );

        datadistrict.value = response.data.data || []
    } catch (err) {

    }
    finally {
        loading.value = false
    }
}

const fetchdata_zipcode = async (province_id, city_id, district_id) => {
    try {
        const token = getToken()

        loading.value = true
        const response = await axios.post(`${API_BASE_URL}/Datacustomer/getZipcode?province_id=${province_id}&city_id=${city_id}&district_id=${district_id}`, {

        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': `${getToken()}`
            }
        }
        );

        datazipcode.value = response.data.data || []
    } catch (err) {

    } finally {
        loading.value = false
    }
}

watch(() => props.userData, (newUserData) => {
    if (newUserData && props.viewMode) {
        loadUserDataToForm(newUserData) // ✅ แก้ไข: ส่ง newUserData โดยตรง ไม่ใช่ newUserData.itemid
    }
}, { immediate: true })


watch(selectedProvince, (newProvinceId) => {
    if (newProvinceId) {
        datacity.value = []
        datadistrict.value = []
        datazipcode.value = []
        selectedAmphure.value = ''
        selectedDistrict.value = ''
        fetchdata_city(newProvinceId)
    }
})

// ✅ Watch สำหรับเมื่อเลือกอำเภอเปลี่ยนแปลง
watch(selectedAmphure, (newAmphureId) => {
    if (newAmphureId && selectedProvince.value) {
        datadistrict.value = []
        datazipcode.value = []
        selectedDistrict.value = ''
        fetchdata_district(selectedProvince.value, newAmphureId)
    }
})

// ✅ Watch สำหรับเมื่อเลือกตำบลเปลี่ยนแปลง
watch(selectedDistrict, (newDistrictId) => {
    if (newDistrictId && selectedProvince.value && selectedAmphure.value) {
        datazipcode.value = []
        fetchdata_zipcode(selectedProvince.value, selectedAmphure.value, newDistrictId)
    }
})



const senddata_customer = async () => {

    if (props.viewMode) return

    const token = getToken()



    const zipcode = datazipcode.value[0]?.zipcode || ''

    if (!firstname.value) {
        successMessage.value = 'กรุณากรอกชื่อ'
        type_Dialog.value = 'error'
        showSuccessDialog.value = true

        return;
    }

    if (!lastname.value) {
        successMessage.value = 'กรุณากรอกนามสกุล'
        type_Dialog.value = 'error'
        showSuccessDialog.value = true

        return;
    }

    if (!selectedDate.value) {
        successMessage.value = 'กรุณาเลือกวันเกิด'
        type_Dialog.value = 'error'
        showSuccessDialog.value = true

        return;
    }

    if (!address.value) {
        successMessage.value = 'กรุณากรอกที่อยู่'
        type_Dialog.value = 'error'
        showSuccessDialog.value = true

        return;
    }
    if (!selectedProvince.value) {

        successMessage.value = 'กรุณาเลือกจังหวัด'
        type_Dialog.value = 'error'
        showSuccessDialog.value = true

        return;

    }

    if (!selectedAmphure.value) {

        successMessage.value = 'กรุณาเลือกอำเภอ'
        type_Dialog.value = 'error'
        showSuccessDialog.value = true

        return;

    }

    if (!selectedDistrict.value) {

        successMessage.value = 'กรุณาเลือกตำบล'
        type_Dialog.value = 'error'
        showSuccessDialog.value = true

        return;

    }
    if (!zipcode) {

        successMessage.value = 'กรุณากรอกรหัสไปษณีย์'
        type_Dialog.value = 'error'
        showSuccessDialog.value = true

        return;
    }



    try {
        loading.value = true
        const response = await axios.post(`${API_BASE_URL}/Datacustomer/savedatacustomer`, {
            firstname: firstname.value,
            lastname: lastname.value,
            birthday: selectedDate.value,
            address: address.value,
            province_id: selectedProvince.value,
            city_id: selectedAmphure.value,
            district_id: selectedDistrict.value,
            zipcode: zipcode
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': `${getToken()}`
            }
        }
        );
        console.log('response:', response.data);
        if (response.data.status != 200) {
            successMessage.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
            showSuccessDialog.value = true
            type_Dialog.value = 'error'

        } else {
            successMessage.value = response.data.message;
            type_Dialog.value = 'success'
            showSuccessDialog.value = true;

        }


        // ✅ รีเซ็ตฟอร์ม
        resetForm()

        // ✅ ส่ง event ไปให้ parent refresh ข้อมูล
        emit('refresh')


    } catch (err) {
        successMessage.value = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล'
        showSuccessDialog.value = true
        type_Dialog.value = 'error'
    }
    finally {
        loading.value = false
    }
}

const resetForm = () => {
    firstname.value = ''
    lastname.value = ''
    selectedDate.value = ''
    address.value = ''
    selectedProvince.value = ''
    selectedAmphure.value = ''
    selectedDistrict.value = ''

    datazipcode.value = []
    datacity.value = []
    datadistrict.value = []
}

const closeSuccessDialog = () => {
    showSuccessDialog.value = false
    // ถ้าเป็น success ให้ปิด modal ด้วย
    if (successMessage.value.includes('สำเร็จ')) {
        emit('close')
    }
}

const maxDate = computed(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
})

onMounted(() => {
    fetchdata_province();
    if (props.viewMode && props.userData) {
        loadUserDataToForm(props.userData)
    } else {
        selectedProvince.value = 0;
        selectedDistrict.value = 0;
        selectedAmphure.value = 0
    }

})


</script>

<template>

    <div v-if="loading" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-1000">
        <div class="bg-white p-8 rounded-lg shadow-lg text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p class="text-gray-700">กำลังประมวลผล...</p>
        </div>
    </div>

    <!-- ✅ Success Dialog -->
    <div v-if="showSuccessDialog" class="fixed inset-0 bg-gray-500/70  flex items-center justify-center z-1000">
        <div class=" w-100 bg-white p-6 rounded-lg shadow-lg text-center max-w-sm">
            <div v-if="type_Dialog == 'success'" class="text-green-500 text-4xl mb-4">✅</div>
            <div v-else class="text-red-500 text-4xl mb-4">❌</div>
            <h3 class="text-lg font-semibold mb-2">{{ successMessage }}</h3>
            <button @click="closeSuccessDialog"
                class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 mt-4">
                ตกลง
            </button>
        </div>
    </div>

    <div class="modal-me" tabindex="0" role="dialog" @click.self="$emit('close')">
        <div class="modal-me-dialog modal-me-center" @click.stop>
            <div class="modal-me-content" id="dp-teleport-target">
                <div class="modal-me-header flex justify-between">
                    <span>{{ txt_header }}</span>
                    <span @click="$emit('close')" class="cursor-pointer">X</span>
                </div>
                <div class="modal-me-body ">

                    <div v-if="loading"
                        class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                        <div class="text-center">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2">
                            </div>
                            <p class="text-sm text-gray-600">กำลังโหลด...</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <span>ชื่อ - นามสกุล</span>
                        </div>
                        <div>
                            <input_field v-model="firstname" type="text" txt_placeholder="ชื่อ" color_border="yellow"
                                :disabled="viewMode"    maxlength="250" />
                            <div class="flex justify-end">
                                <span class="text-sm"  >{{ firstname.length+"/"+"250" }}</span>
                            </div>
                        </div>
                        <div>
                            <input_field v-model="lastname" id="lastname" type="text" txt_placeholder="นามสกุล"
                                :disabled="viewMode" maxlength="250" />
                            <div class="flex justify-end">
                                <span class="text-sm" >{{ lastname.length+"/"+"250" }}</span>
                            </div>
                        </div>
                    </div>

                    <div class="my-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                            <span>วันเกิด</span>
                        </div>
                        <div @click.stop>
                            <input type="date" v-model="selectedDate" :max="maxDate" :disabled="viewMode"
                                class="border border-gray-300 rounded p-2 w-full" />
                        </div>
                    </div>

                    <div class="my-3 grid grid-cols-2  md:grid-cols-3 gap-3">
                        <div>
                            <span>อายุ</span>
                        </div>
                        <div>
                            <span class="font-bold">
                                {{ age }}
                            </span>
                            <span class="px-2">
                                ปี
                            </span>
                        </div>
                    </div>
                    <div class="my-3 grid grid-cols-1  md:grid-cols-3 gap-3">
                        <div>
                            <span>ที่อยู่</span>
                        </div>
                        <div class="col-span-2">
                            <textarea :disabled="viewMode" class="w-full px-4 py-2 border border-gray-300 rounded-lg 
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                                    focus:border-blue-500 transition duration-150" v-model="address" maxlength="250"></textarea>
                            <div class="flex justify-end">
                                <span class="text-sm" >{{ address.length+"/"+"250" }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- จังหวัด -->
                    <div class="my-3 grid grid-cols-1  md:grid-cols-3 gap-3">
                        <div>
                            <span>จังหวัด</span>
                        </div>
                        <div>
                            <select :disabled="viewMode" class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg
                                                        focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                         focus:border-blue-500 transition duration-150"
                                v-model="selectedProvince">
                                <option selected value="0">-- เลือกจังหวัด --</option>
                                <option v-for="data in dataprovince" :key="data.province_id" :value="data.province_id">
                                    {{ data.province_th }}
                                </option>
                            </select>
                        </div>
                        <div></div>
                    </div>

                    <!-- อำเภอ/เขต -->
                    <div class="my-3 grid grid-cols-1  md:grid-cols-3 gap-3">
                        <div>
                            <span>อำเภอ / เขต</span>
                        </div>
                        <div>

                            <select :disabled="viewMode" class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg
                                                        focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                         focus:border-blue-500 transition duration-150"
                                v-model="selectedAmphure">
                                <option selected value="0">-- เลือกอำเภอ --</option>
                                <option v-for="data in datacity" :key="data.city_id" :value="data.city_id">
                                    {{ data.city_th }}
                                </option>
                            </select>


                        </div>
                        <div></div>
                    </div>

                    <!-- ตำบล/แขวง -->
                    <div class="my-3 grid grid-cols-1  md:grid-cols-3 gap-3">
                        <div>
                            <span>ตําบล / แขวง</span>
                        </div>
                        <div>
                            <select :disabled="viewMode" class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg
                                                        focus:outline-none focus:ring-2 focus:ring-blue-500 
                                                         focus:border-blue-500 transition duration-150"
                                v-model="selectedDistrict">
                                <option selected value="0">-- เลือกตำบล --</option>
                                <option v-for="data in datadistrict" :key="data.district_id" :value="data.district_id">
                                    {{ data.district_th }}
                                </option>
                            </select>
                        </div>
                        <div></div>
                    </div>

                    <div class="my-3 grid grid-cols-1  md:grid-cols-3 gap-3">
                        <div>
                            <span>รหัสไปษณีย์</span>
                        </div>
                        <div>
                            <input_field :disabled="viewMode" :modelValue="datazipcode[0]?.zipcode || ''" type="text"
                                txt_placeholder="รหัสไปษณีย์" />
                        </div>
                        <div></div>
                    </div>

                </div>
                <div class="modal-me-footer gap-4" v-if="!viewMode">
                    <button_blue msg="บันทึก" @click="senddata_customer()"></button_blue>
                    <button_red msg="ยกเลิก" @click="$emit('close')"></button_red>
                </div>
                <div class="modal-me-footer gap-4" v-else>
                    <button_blue msg="ปิด" @click="$emit('close')"></button_blue>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-me {
    height: 100%;
    background: #00000085;
    position: fixed;
    top: 0px;
    left: 0;
    width: 100%;
    z-index: 500;
    overflow-x: hidden;
    overflow-y: auto;
}

.modal-me-dialog {
    width: auto;
    margin: 1.75rem;
    display: flex;
}

.modal-me-dialog .modal-me-center {
    position: relative;
    align-items: center;
    min-height: 250px;
}

.modal-me-content {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: white;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
}

.modal-me-header {
    display: flex;
    flex-shrink: 0;
    padding: 1rem 1rem;
}

.modal-me-body {
    padding: 1rem 2.25rem 1rem 2.25rem;
    position: relative;
    flex: 1 1 auto;
}

.modal-me-footer {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    padding: 0.75rem;
    border-top: 1px solid #dee2e6;
    border-bottom-right-radius: calc(0.3rem - 1px);
    border-bottom-left-radius: calc(0.3rem - 1px);
}

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