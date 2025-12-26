import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDraggable,
} from "@heroui/react";
import { useRef, useState, useEffect } from "react";
import { CloseButton } from "../CloseButton";
import { QrCodeFilled, ArrowDownloadFilled } from "@fluentui/react-icons";
import { getQrCodeImage } from "../../service/product";

export const ProductQRModal = ({ isOpen, onOpenChange, product }) => {
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  const [qrImage, setQrImage] = useState(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);

  useEffect(() => {
    if (product?.qrHash && isOpen) {
      loadQrImage();
    }
  }, [product, isOpen]);

  const loadQrImage = async () => {
    try {
      setIsLoadingQr(true);
      const imageBlob = await getQrCodeImage(product.qrHash);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrImage(reader.result);
      };
      reader.readAsDataURL(imageBlob);
    } catch (error) {
      console.error("Error loading QR:", error);
    } finally {
      setIsLoadingQr(false);
    }
  };

  const handleDownloadQr = () => {
    if (!qrImage || !product) return;

    const link = document.createElement("a");
    link.href = qrImage;
    link.download = `QR_${product.lote}_${"producto"}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      hideCloseButton
      size="lg"
      radius="lg"
      className="my-0"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{ wrapper: "overflow-hidden", backdrop: "bg-black/20" }}
      ref={targetRef}
    >
      <ModalContent className="bg-background max-h-[80dvh]">
        {(onClose) => (
          <>
            <ModalHeader
              {...moveProps}
              className="flex flex-col gap-2 pb-4 pt-4"
            >
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <QrCodeFilled className="size-6 text-primary" />
                  <p className="text-lg font-bold">Código QR</p>
                </div>
                <CloseButton onPress={onClose} />
              </div>
              <p className="text-sm font-normal text-background-500">
                Código QR del producto
              </p>
            </ModalHeader>
            <ModalBody className="py-6 gap-6 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary">
              <div className="flex flex-col items-center gap-6 w-full overflow-x-hidden">
                <div className="bg-white p-4 rounded-lg shadow-large">
                  {isLoadingQr ? (
                    <div className="w-64 h-64 flex items-center justify-center">
                      <Spinner color="primary" size="lg" />
                    </div>
                  ) : qrImage ? (
                    <img src={qrImage} alt="QR Code" className="w-64 h-64" />
                  ) : (
                    <div className="w-64 h-64 flex flex-col items-center justify-center bg-background-100 rounded-lg">
                      <QrCodeFilled className="size-16 text-background-500" />
                      <p className="text-background-500 mt-4">No disponible</p>
                    </div>
                  )}
                </div>

                <div className="w-full flex flex-col gap-2 bg-background-100 p-4 rounded-lg overflow-x-hidden">
                  <div className="flex justify-between gap-4">
                    <p className="text-sm text-background-500 flex-shrink-0">
                      Lote:
                    </p>
                    <p className="text-sm font-medium break-all text-right">
                      {product?.lote}
                    </p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p className="text-sm text-background-500 flex-shrink-0">
                      Lote Proveedor:
                    </p>
                    <p className="text-sm font-medium break-all text-right">
                      {product?.loteProveedor}
                    </p>
                  </div>
                  {product?.stockCatalogueName && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-background-500">Catálogo:</p>
                      <p className="text-sm font-medium break-all text-right">
                        {product.stockCatalogueName}
                      </p>
                    </div>
                  )}
                  {product?.productStatusName && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-background-500">Estado:</p>
                      <p className="text-sm font-medium break-all text-right">
                        {product.productStatusName}
                      </p>
                    </div>
                  )}
                  {product?.unitOfMeasurementName && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-background-500">Unidad:</p>
                      <p className="text-sm font-medium break-all text-right">
                        {product.unitOfMeasurementName} (
                        {product.unitOfMeasurementCode})
                      </p>
                    </div>
                  )}
                  {product?.warehouseTypeName && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-background-500">
                        Tipo Almacén:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {product.warehouseTypeName}
                      </p>
                    </div>
                  )}

                  {product?.codigoProducto && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-background-500">
                        Código Producto:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {product.codigoProducto}
                      </p>
                    </div>
                  )}

                  {product?.numeroAnalisis && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-background-500">
                        N° Análisis:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {product.numeroAnalisis}
                      </p>
                    </div>
                  )}

                  {product?.fecha && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-background-500">
                        Fecha Ingreso:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {product.fecha}
                      </p>
                    </div>
                  )}

                  {product?.caducidad && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-background-500">
                        Fecha Caducidad:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {product.caducidad}
                      </p>
                    </div>
                  )}

                  {product?.reanalisis && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-background-500">
                        Fecha Reanálisis:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {product.reanalisis}
                      </p>
                    </div>
                  )}
                  {(product?.muestreo || product?.fechaMuestreo) && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-background-500">
                        Fecha muestreo:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {product?.muestreo ?? product?.fechaMuestreo}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <p className="text-sm text-background-500">
                      Cantidad Total:
                    </p>
                    <p className="text-sm font-medium break-all text-right">
                      {product?.cantidadTotal}
                    </p>
                  </div>
                  <div className="flex justify-between gap-4">
                    <p className="text-sm text-background-500">
                      N° Contenedores:
                    </p>
                    <p className="text-sm font-medium break-all text-right">
                      {product?.numeroContenedores}
                    </p>
                  </div>
                  {product?.fabricante && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-background-500">Fabricante:</p>
                      <p className="text-sm font-medium break-all text-right">
                        {product.fabricante}
                      </p>
                    </div>
                  )}
                  {product?.distribuidor && (
                    <div className="flex justify-between gap-4">
                      <p className="text-sm text-background-500">
                        Distribuidor:
                      </p>
                      <p className="text-sm font-medium break-all text-right">
                        {product.distribuidor}
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full tracking-wide font-medium data-[hover=true]:-translate-y-1"
                  radius="sm"
                  variant="shadow"
                  color="primary"
                  startContent={<ArrowDownloadFilled className="size-5" />}
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
  );
};
