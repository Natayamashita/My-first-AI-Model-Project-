<script lang="ts">
  import { onMount } from "svelte";
  import { io } from 'socket.io-client';

    let socket : any;
    let messages: any[]  = [
        //{type:`receive`, msg:`teste`},{type:`send`, msg:`testesebd`}

    ]

    let inputText : any = ``
    onMount(()=> {
        socket = io("http://localhost:8080");

        socket.on('response', (msg : any) => {
            console.log(`msg`, msg)
            messages.push({
                type: "receive",
                msg: msg,
            })
            messages = messages
        })
        // socket.close()
    })

    function sendMessage() {
        if (inputText.trim() === '') return; // Prevent sending empty messages
        console.log(inputText)
        messages.push({
            type: "send",
            msg: inputText
        })
        messages = [...messages];
        console.log(messages)
        socket.emit('message', inputText)
        inputText = ``
    }

</script>
<div class="w-screen h-screen flex flex-col bg-base-100 p-4">

    <div class="join" >
        <input type="text" class="input input-bordered w-full" bind:value={inputText} on:keyup={(e)=>{
            if (e.key == `Enter` && inputText) {
                sendMessage()
            } 
        }}>
    
        <button class="btn h-full btn-primary bg-blue-600" on:click={()=>{
            if (inputText) sendMessage()
        }}>Button</button>

    </div>

    <div class="w-full flex flex-col">
        {#each messages as msg, i (i)}
            <div class="border rounded-md bg-base-200 my-2 p-2 {msg.type == "receive" ? "text-right text-white chat-bubble-primary" : "chat-bubble-secondary bg-indigo-500 text-white"}">
                {msg.msg}
            </div>
        {/each} 
    </div>
</div>