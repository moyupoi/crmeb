export default function useDialog(initValue: boolean = false) {
  const bool: globalThis.Ref<boolean> = ref(initValue)
  const DialogOpen = () => {
    bool.value = true
  }
  const DialogClose = () => {
    bool.value = false
  }

  return {
    bool,
    DialogOpen,
    DialogClose,
    // /handleDialogOpen,
  }
}
