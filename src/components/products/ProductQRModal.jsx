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
import { getProductByQrHash, getQrCodeImage } from "../../service/product";
import { formatDateLiteral } from "../../js/utils";

export const ProductQRModal = ({ isOpen, onOpenChange, product }) => {
  const targetRef = useRef(null);
  const { moveProps } = useDraggable({ targetRef, isDisabled: !isOpen });

  const [qrImage, setQrImage] = useState(null);
  const [isLoadingQr, setIsLoadingQr] = useState(false);

  const [fullProduct, setFullProduct] = useState(null);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);

  useEffect(() => {
    if (product?.qrHash && isOpen) {
      loadQrImage();
      loadProductDetails();
    }
  }, [product, isOpen]);

  const loadProductDetails = async () => {
    try {
      setIsLoadingProduct(true);
      const data = await getProductByQrHash(product.qrHash);
      setFullProduct(data);
    } catch (error) {
      console.error("Error loading product details:", error);
      setFullProduct(null);
    } finally {
      setIsLoadingProduct(false);
    }
  };

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
      scrollBehavior="inside"
      placement="center"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      classNames={{
        wrapper: "overflow-hidden p-0",
        backdrop: "bg-black/20",
      }}
      ref={targetRef}
    >
      <ModalContent className="bg-background w-[100vw] sm:w-auto max-w-none sm:max-w-[36rem] h-[100dvh] rounded-none sm:rounded-2xl flex flex-col overflow-hidden">
        {(onClose) => (
          <>
            <ModalHeader
              {...moveProps}
              className="flex-none flex flex-col gap-2 pb-3 pt-3 sm:pb-4 sm:pt-4"
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
            <ModalBody className="flex-1 min-h-0 py-4 sm:py-6 gap-4 sm:gap-6 overflow-y-auto overflow-x-hidden">
              {(() => {
                const p = fullProduct || product;
                const createdAt = p?.createdAt;
                const qrHash = p?.qrHash || product?.qrHash;
                const nombre = p?.nombre;
                const fechaIngreso = p?.fechaIngreso || p?.fecha;
                const fechaCaducidad = p?.fechaCaducidad || p?.caducidad;
                const fechaReanalisis = p?.reanalisis;
                const fechaMuestreo = p?.muestreo || p?.fechaMuestreo;

                return (
                  <div className="flex flex-col items-center gap-6 w-full overflow-x-hidden">
                    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-large">
                      {isLoadingQr ? (
                        <div className="w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 flex items-center justify-center">
                          <Spinner color="primary" size="lg" />
                        </div>
                      ) : qrImage ? (
                        <img
                          src={qrImage}
                          alt="QR Code"
                          className="w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 object-contain"
                        />
                      ) : (
                        <div className="w-52 h-52 sm:w-60 sm:h-60 md:w-64 md:h-64 flex flex-col items-center justify-center bg-background-100 rounded-lg">
                          <QrCodeFilled className="size-16 text-background-500" />
                          <p className="text-background-500 mt-4">No disponible</p>
                        </div>
                      )}
                    </div>

                    <div className="w-full flex flex-col gap-2">
                      <div className="w-full flex flex-col">
                        <p className="text-sm font-semibold">Detalles del producto</p>
                        <p className="text-xs text-background-500">
                          Revise la información completa del producto. Esta vista es solo de lectura.
                        </p>
                      </div>

                      <div className="w-full flex flex-col gap-2 bg-background-100 p-3 sm:p-4 rounded-lg overflow-x-hidden">
                        {(isLoadingProduct || createdAt) && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500 flex-shrink-0">
                              Fecha de creación:
                            </p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {isLoadingProduct
                                ? "Cargando..."
                                : formatDateLiteral(createdAt, true)}
                            </p>
                          </div>
                        )}

                        {(isLoadingProduct || qrHash) && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500 flex-shrink-0">
                              Hash QR:
                            </p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {isLoadingProduct ? "Cargando..." : qrHash}
                            </p>
                          </div>
                        )}

                        {nombre && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500 flex-shrink-0">
                              Nombre:
                            </p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {nombre}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-between gap-4">
                          <p className="text-xs sm:text-sm text-background-500 flex-shrink-0">
                            Lote:
                          </p>
                          <p className="text-xs sm:text-sm font-medium break-all text-right">
                            {p?.lote}
                          </p>
                        </div>
                        <div className="flex justify-between gap-4">
                          <p className="text-xs sm:text-sm text-background-500 flex-shrink-0">
                            Lote Proveedor:
                          </p>
                          <p className="text-xs sm:text-sm font-medium break-all text-right">
                            {p?.loteProveedor}
                          </p>
                        </div>
                        {p?.stockCatalogueName && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500">Catálogo:</p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {p.stockCatalogueName}
                            </p>
                          </div>
                        )}
                        {p?.productStatusName && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500">Estado:</p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {p.productStatusName}
                            </p>
                          </div>
                        )}
                        {p?.unitOfMeasurementName && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500">Unidad:</p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {p.unitOfMeasurementName} ({p.unitOfMeasurementCode})
                            </p>
                          </div>
                        )}
                        {p?.warehouseTypeName && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500">
                              Tipo Almacén:
                            </p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {p.warehouseTypeName}
                            </p>
                          </div>
                        )}

                        {p?.codigoProducto && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500">
                              Código Producto:
                            </p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {p.codigoProducto}
                            </p>
                          </div>
                        )}

                        {p?.numeroAnalisis && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500">
                              N° Análisis:
                            </p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {p.numeroAnalisis}
                            </p>
                          </div>
                        )}

                        {fechaIngreso && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500">
                              Fecha Ingreso:
                            </p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {fechaIngreso}
                            </p>
                          </div>
                        )}

                        {fechaCaducidad && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500">
                              Fecha Caducidad:
                            </p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {fechaCaducidad}
                            </p>
                          </div>
                        )}

                        {fechaReanalisis && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500">
                              Fecha Reanálisis:
                            </p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {fechaReanalisis}
                            </p>
                          </div>
                        )}

                        {fechaMuestreo && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500">
                              Fecha muestreo:
                            </p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {fechaMuestreo}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-between gap-4">
                          <p className="text-xs sm:text-sm text-background-500">
                            Cantidad Total:
                          </p>
                          <p className="text-xs sm:text-sm font-medium break-all text-right">
                            {p?.cantidadTotal}
                          </p>
                        </div>
                        <div className="flex justify-between gap-4">
                          <p className="text-xs sm:text-sm text-background-500">
                            N° Contenedores:
                          </p>
                          <p className="text-xs sm:text-sm font-medium break-all text-right">
                            {p?.numeroContenedores}
                          </p>
                        </div>
                        {p?.fabricante && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500">
                              Fabricante:
                            </p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {p.fabricante}
                            </p>
                          </div>
                        )}
                        {p?.distribuidor && (
                          <div className="flex justify-between gap-4">
                            <p className="text-xs sm:text-sm text-background-500">
                              Distribuidor:
                            </p>
                            <p className="text-xs sm:text-sm font-medium break-all text-right">
                              {p.distribuidor}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full min-h-[48px] h-12 tracking-wide font-medium text-sm sm:text-base rounded-[10px] data-[hover=true]:-translate-y-1"
                      radius="none"
                      variant="shadow"
                      color="primary"
                      startContent={<ArrowDownloadFilled className="size-5" />}
                      onPress={handleDownloadQr}
                      isDisabled={isLoadingQr || !qrImage}
                    >
                      Descargar código QR
                    </Button>
                  </div>
                );
              })()}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
