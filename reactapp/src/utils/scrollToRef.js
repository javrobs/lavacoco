
export default function scrollToRef(refChoice){
    console.log("trying to scroll",refChoice.current)
    refChoice.current.scrollIntoView({block:"start",behavior:"smooth"})
}