import { Button, Modal, ModalBody, ModalContent, ModalHeader, Spinner, useDraggable } from "@heroui/react"
import { useRef, useState, useEffect } from "react"
import { CloseButton } from "../CloseButton"
import { QrCodeFilled, ArrowDownloadFilled } from "@fluentui/react-icons"
import { getQrCodeImage } from "../../service/product"

export const ProductQRModal = ({isOpen, onOpenChange, product}) => {
    const targetRef = useRef(null)
    const {moveProps} = useDraggable({targetRef, isDisabled: !isOpen})

    const [qrImage, setQrImage] = useState(null)
    const [isLoadingQr, setIsLoadingQr] = useState(false)

    useEffect(() => {
        if (product?.qrHash && isOpen) {
            loadQrImage()
        }
    }, [product, isOpen])

    const loadQrImage = async () => {
        try {
            setIsLoadingQr(true)
            const imageBlob = await getQrCodeImage(product.qrHash)
            const reader = new FileReader()
            reader.onloadend = () => {
                setQrImage(reader.result)
            }
            reader.readAsDataURL(imageBlob)
        } catch (error) {
            console.error('Error loading QR:', error)
        } finally {
            setIsLoadingQr(false)
        }
    }

    const handleDownloadQr = () => {
        if (!qrImage || !product) return

        const link = document.createElement('a')
        link.href = qrImage
        link.download = `QR_${product.lote}_${product.numeroSerie || 'producto'}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <Modal
            hideCloseButton
            size="lg"
            radius="lg"
            className="my-0"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            classNames={{wrapper: "overflow-hidden", backdrop: "bg-black/20"}}
            ref={targetRef} 
        >
            <ModalContent className="bg-background">
                {(onClose) => (
                    <>
                    <ModalHeader {...moveProps} className="flex flex-col gap-2 pb-4 pt-4">
                        <div className="w-full flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <QrCodeFilled className="size-6 text-primary"/>
                                <p className="text-lg font-bold">Código QR</p>
                            </div>
                            <CloseButton onPress={onClose}/>     
                        </div>
                        <p className="text-sm font-normal text-background-500">Código QR del producto</p>
                    </ModalHeader>
                    <ModalBody className="py-6 gap-6">
                        <div className="flex flex-col items-center gap-6">
                            <div className="bg-white p-4 rounded-lg shadow-large">
                                {isLoadingQr ? (
                                    <div className="w-64 h-64 flex items-center justify-center">
                                        <Spinner color="primary" size="lg" />
                                    </div>
                                ) : qrImage ? (
                                    <img src={qrImage} alt="QR Code" className="w-64 h-64" />
                                ) : (
                                    <div className="w-64 h-64 flex flex-col items-center justify-center bg-background-100 rounded-lg">
                                        <QrCodeFilled className="size-16 text-background-500"/>
                                        <p className="text-background-500 mt-4">No disponible</p>
                                    </div>
                                )}
                            </div>

                            <div className="w-full flex flex-col gap-2 bg-background-100 p-4 rounded-lg">
                                <div className="flex justify-between">
                                    <p className="text-sm text-background-500">Lote:</p>
                                    <p className="text-sm font-medium">{product?.lote}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm text-background-500">Lote Proveedor:</p>
                                    <p className="text-sm font-medium">{product?.loteProveedor}</p>
                                </div>
                                {product?.numeroSerie && (
                                    <div className="flex justify-between">
                                        <p className="text-sm text-background-500">N° Serie:</p>
                                        <p className="text-sm font-medium">{product.numeroSerie}</p>
                                    </div>
                                )}
                                {product?.stockCatalogueName && (
                                    <div className="flex justify-between">
                                        <p className="text-sm text-background-500">Catálogo:</p>
                                        <p className="text-sm font-medium">{product.stockCatalogueName}</p>
                                    </div>
                                )}
                                {product?.productStatusName && (
                                    <div className="flex justify-between">
                                        <p className="text-sm text-background-500">Estado:</p>
                                        <p className="text-sm font-medium">{product.productStatusName}</p>
                                    </div>
                                )}
                                {product?.unitOfMeasurementName && (
                                    <div className="flex justify-between">
                                        <p className="text-sm text-background-500">Unidad:</p>
                                        <p className="text-sm font-medium">{product.unitOfMeasurementName} ({product.unitOfMeasurementCode})</p>
                                    </div>
                                )}
                                {product?.warehouseTypeName && (
                                    <div className="flex justify-between">
                                        <p className="text-sm text-background-500">Tipo Almacén:</p>
                                        <p className="text-sm font-medium">{product.warehouseTypeName}</p>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <p className="text-sm text-background-500">Cantidad:</p>
                                    <p className="text-sm font-medium">{product?.cantidadSobrante}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm text-background-500">Cantidad Total:</p>
                                    <p className="text-sm font-medium">{product?.cantidadTotal}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm text-background-500">N° Contenedores:</p>
                                    <p className="text-sm font-medium">{product?.numeroContenedores}</p>
                                </div>
                                {product?.fabricante && (
                                    <div className="flex justify-between">
                                        <p className="text-sm text-background-500">Fabricante:</p>
                                        <p className="text-sm font-medium">{product.fabricante}</p>
                                    </div>
                                )}
                                {product?.distribuidor && (
                                    <div className="flex justify-between">
                                        <p className="text-sm text-background-500">Distribuidor:</p>
                                        <p className="text-sm font-medium">{product.distribuidor}</p>
                                    </div>
                                )}
                            </div>

                            <Button
                                className="w-full tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                radius="sm"
                                variant="shadow"
                                color="primary"
                                startContent={<ArrowDownloadFilled className="size-5"/>}
                                onPress={handleDownloadQr}
                                isDisabled={isLoadingQr || !qrImage}
                            >
                                Descargar código QR
                            </Button>
                        </div>
                    </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
