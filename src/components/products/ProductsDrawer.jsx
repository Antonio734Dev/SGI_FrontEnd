import { addToast, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, Form, Input, Select, SelectItem, useDisclosure } from "@heroui/react"
import { CloseButton } from "../CloseButton"
import { ArrowHookUpRightFilled, CheckmarkFilled, ChevronDownFilled, DismissCircleFilled, DismissFilled, TextAsteriskFilled } from "@fluentui/react-icons"
import { useEffect, useState } from "react"
import { required } from "../../js/validators"
import { ProductsModal } from "./ProductsModal"
import { formatDateLiteral } from "../../js/utils"
import { getStockCatalogues, getProductStatuses, getUnitsOfMeasurement, getWarehouseTypes } from "../../service/product"

export const ProductsDrawer = ({isOpen, onOpenChange, data, action, onRefresh}) => {
    const {isOpen: isModalOpen, onOpen: onModalOpen, onOpenChange: onModalOpenChange} = useDisclosure()
    
    const [isLoading, setIsLoading] = useState(false)
    const [catalogues, setCatalogues] = useState([])
    const [statuses, setStatuses] = useState([])
    const [units, setUnits] = useState([])
    const [warehouseTypes, setWarehouseTypes] = useState([])

    const [product, setProduct] = useState({
        id: data?.id || "",
        stockCatalogueId: data?.stockCatalogueId || "",
        productStatusId: data?.productStatusId || "",
        unitOfMeasurementId: data?.unitOfMeasurementId || "",
        warehouseTypeId: data?.warehouseTypeId || "",
        lote: data?.lote || "",
        loteProveedor: data?.loteProveedor || "",
        numeroSerie: data?.numeroSerie || "",
        fabricante: data?.fabricante || "",
        distribuidor: data?.distribuidor || "",
        fechaIngreso: data?.fecha || "",
        fechaCaducidad: data?.caducidad || "",
        cantidad: data?.cantidadSobrante || "",
        cantidadTotal: data?.cantidadTotal || "",
        numeroContenedores: data?.numeroContenedores || "",
    })

    const [productErrors, setProductErrors] = useState({ 
        stockCatalogueId: [],
        productStatusId: [],
        unitOfMeasurementId: [],
        warehouseTypeId: [],
        lote: [],
        loteProveedor: [],
        numeroSerie: [],
        fabricante: [],
        distribuidor: [],
        fechaIngreso: [],
        fechaCaducidad: [],
        cantidad: [],
        cantidadTotal: [],
        numeroContenedores: [],
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cataloguesRes, statusesRes, unitsRes, warehouseTypesRes] = await Promise.all([
                    getStockCatalogues(),
                    getProductStatuses(),
                    getUnitsOfMeasurement(),
                    getWarehouseTypes()
                ])
                
                setCatalogues(cataloguesRes?.data || [])
                setStatuses(statusesRes?.data || [])
                setUnits(unitsRes?.data || [])
                setWarehouseTypes(warehouseTypesRes?.data || [])
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }
        
        if (isOpen) {
            fetchData()
        }
    }, [isOpen])

    useEffect(() => {
        setProduct({
            id: data?.id || "",
            stockCatalogueId: data?.stockCatalogueId || "",
            productStatusId: data?.productStatusId || "",
            unitOfMeasurementId: data?.unitOfMeasurementId || "",
            warehouseTypeId: data?.warehouseTypeId || "",
            lote: data?.lote || "",
            loteProveedor: data?.loteProveedor || "",
            numeroSerie: data?.numeroSerie || "",
            fabricante: data?.fabricante || "",
            distribuidor: data?.distribuidor || "",
            fechaIngreso: data?.fecha || "",
            fechaCaducidad: data?.caducidad || "",
            cantidad: data?.cantidadSobrante || "",
            cantidadTotal: data?.cantidadTotal || "",
            numeroContenedores: data?.numeroContenedores || "",
        })

        setProductErrors({
            stockCatalogueId: [],
            productStatusId: [],
            unitOfMeasurementId: [],
            warehouseTypeId: [],
            lote: [],
            loteProveedor: [],
            numeroSerie: [],
            fabricante: [],
            distribuidor: [],
            fechaIngreso: [],
            fechaCaducidad: [],
            cantidad: [],
            cantidadTotal: [],
            numeroContenedores: [],
        })
    }, [data, action])

    const resetForm = () => {
        setProduct({ 
            id: "", 
            stockCatalogueId: "", 
            productStatusId: "", 
            unitOfMeasurementId: "", 
            warehouseTypeId: "", 
            lote: "", 
            loteProveedor: "", 
            numeroSerie: "", 
            fabricante: "", 
            distribuidor: "", 
            fechaIngreso: "", 
            fechaCaducidad: "", 
            cantidad: "", 
            cantidadTotal: "", 
            numeroContenedores: "" 
        })
        setProductErrors({ 
            stockCatalogueId: [], 
            productStatusId: [], 
            unitOfMeasurementId: [], 
            warehouseTypeId: [], 
            lote: [], 
            loteProveedor: [], 
            numeroSerie: [], 
            fabricante: [], 
            distribuidor: [], 
            fechaIngreso: [], 
            fechaCaducidad: [], 
            cantidad: [], 
            cantidadTotal: [], 
            numeroContenedores: [] 
        })
    }

    const validators = {
        stockCatalogueId: [required],
        productStatusId: [required],
        unitOfMeasurementId: [required],
        warehouseTypeId: [required],
        lote: [required],
        loteProveedor: [required],
        numeroSerie: [],
        fabricante: [],
        distribuidor: [],
        fechaIngreso: [required],
        fechaCaducidad: [required],
        cantidad: [required],
        cantidadTotal: [required],
        numeroContenedores: [required],
    }

    const runValidators = (value, fns) => fns.map(fn => fn(value)).filter(Boolean)

    const handleInputChange = (field, value) => {
        setProduct(prev => ({ ...prev, [field]: value }))

        const fns = validators[field] || []
        const errs = runValidators(value, fns)
        setProductErrors(prev => ({ ...prev, [field]: errs }))
    }

    let title
    let description

    switch (action) {
        case "create":
            title = "Registrar producto"
            description = "Ingrese la información solicitada para poder registrar un nuevo producto."
            break
        case "update":
            title = "Actualizar producto"
            description = "Edite la información necesaria y guarde los cambios para actualizar el producto."
            break
        default:
            title = "Detalles del producto"
            description = "Revise la información completa del producto. Esta vista es solo de lectura."
            break
    }

    const onSubmit = async (e) => {
        e.preventDefault()

        const formEntries = Object.fromEntries(new FormData(e.currentTarget))
        
        const formData = action !== "create"
            ? { id: product.id, ...formEntries }
            : { ...formEntries }

        const errors = {
            stockCatalogueId: runValidators(formData.stockCatalogueId, validators.stockCatalogueId),
            productStatusId: runValidators(formData.productStatusId, validators.productStatusId),
            unitOfMeasurementId: runValidators(formData.unitOfMeasurementId, validators.unitOfMeasurementId),
            warehouseTypeId: runValidators(formData.warehouseTypeId, validators.warehouseTypeId),
            lote: runValidators(formData.lote, validators.lote),
            loteProveedor: runValidators(formData.loteProveedor, validators.loteProveedor),
            fechaIngreso: runValidators(formData.fechaIngreso, validators.fechaIngreso),
            fechaCaducidad: runValidators(formData.fechaCaducidad, validators.fechaCaducidad),
            cantidad: runValidators(formData.cantidad, validators.cantidad),
            cantidadTotal: runValidators(formData.cantidadTotal, validators.cantidadTotal),
            numeroContenedores: runValidators(formData.numeroContenedores, validators.numeroContenedores),
        }

        const hasErrors = Object.values(errors).some(err => err.length > 0)

        if (hasErrors) {
            setProductErrors({
                ...productErrors,
                ...errors
            })
            addToast({
                title: "Atención",
                description: "Por favor corrija los errores en el formulario.",
                color: "warning",
                icon: <DismissCircleFilled className="size-5"/>
            })
            return
        }

        setProductErrors({ 
            stockCatalogueId: [], 
            productStatusId: [], 
            unitOfMeasurementId: [], 
            warehouseTypeId: [], 
            lote: [], 
            loteProveedor: [], 
            numeroSerie: [], 
            fabricante: [], 
            distribuidor: [], 
            fechaIngreso: [], 
            fechaCaducidad: [], 
            cantidad: [], 
            cantidadTotal: [], 
            numeroContenedores: [] 
        })
        setProduct(formData)
        onModalOpen(true)
    }

    return (
        <>
            <Drawer
                hideCloseButton
                size="sm"
                radius="sm"
                isOpen={isOpen} 
                onOpenChange={onOpenChange}
                classNames={{wrapper: "!h-[100dvh]", backdrop: "bg-black/30"}}
                motionProps={{ 
                    variants: {
                        enter: {
                            x: 0,
                            opacity: 1,
                            transition: {
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }
                        },
                        exit: {
                            x: 100,
                            opacity: 0,
                            transition: {
                                duration: 0.3,
                                ease: "easeIn"
                            }
                        }
                    }
                }}
            >
                <DrawerContent className="bg-background">
                    {(onClose) => (
                        <>
                        <DrawerHeader className="flex flex-col gap-2 pb-8">
                            <div className="w-full flex justify-between pt-4 pb-2">
                                <p className="text-lg font-bold">{title}</p>
                                <CloseButton onPress={onClose}/>     
                            </div>
                            <p className="text-sm font-normal">{description}</p>
                        </DrawerHeader>
                        <DrawerBody className="h-full flex flex-col justify-between [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary">
                            <Form onSubmit={onSubmit} id="product-form" className={action === 'create' || action === 'update' ? "gap-6 flex flex-col" : "gap-6 flex flex-col pb-8"}>
                                {action !== "create" && data && (
                                    <div className="flex flex-col gap-4">
                                        <div className="pl-0.5 flex flex-col gap-1">
                                            <p className="text-sm"><span className="font-medium">Fecha de creación: </span>{formatDateLiteral(data.createdAt, true)}</p>
                                            {data.qrHash && <p className="text-sm"><span className="font-medium">Hash QR: </span>{data.qrHash}</p>}
                                        </div>
                                    </div>
                                )}

                                <Select
                                    aria-label="Catálogo"
                                    className="w-full -mt-4"
                                    label={
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-sm">Catálogo</p>
                                            <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                        </div>
                                    }
                                    classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                    name="stockCatalogueId"
                                    selectionMode="single"
                                    disallowEmptySelection
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    labelPlacement="outside"
                                    radius="sm"
                                    variant="bordered"
                                    placeholder={action === "create" ? "Seleccione un catálogo" : data?.stockCatalogue?.name}
                                    selectedKeys={product.stockCatalogueId ? new Set([String(product.stockCatalogueId)]) : new Set([])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('stockCatalogueId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={productErrors.stockCatalogueId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {productErrors.stockCatalogueId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {catalogues.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Select
                                    aria-label="Estado del Producto"
                                    className="w-full -mt-4"
                                    label={
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-sm">Estado</p>
                                            <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                        </div>
                                    }
                                    classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                    name="productStatusId"
                                    selectionMode="single"
                                    disallowEmptySelection
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    labelPlacement="outside"
                                    radius="sm"
                                    variant="bordered"
                                    placeholder={action === "create" ? "Seleccione un estado" : data?.productStatus?.name}
                                    selectedKeys={product.productStatusId ? new Set([String(product.productStatusId)]) : new Set([])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('productStatusId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={productErrors.productStatusId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {productErrors.productStatusId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {statuses.map((status) => (
                                        <SelectItem key={status.id} value={status.id}>
                                            {status.name}
                                        </SelectItem>
                                    ))}
                                </Select>

                                <Select
                                    aria-label="Unidad de Medida"
                                    className="w-full -mt-4"
                                    label={
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-sm">Unidad de Medida</p>
                                            <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                        </div>
                                    }
                                    classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                    name="unitOfMeasurementId"
                                    selectionMode="single"
                                    disallowEmptySelection
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    labelPlacement="outside"
                                    radius="sm"
                                    variant="bordered"
                                    placeholder={action === "create" ? "Seleccione una unidad" : data?.unitOfMeasurementName}
                                    selectedKeys={product.unitOfMeasurementId ? new Set([String(product.unitOfMeasurementId)]) : new Set([])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('unitOfMeasurementId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={productErrors.unitOfMeasurementId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {productErrors.unitOfMeasurementId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {units.map((unit) => {
                                        const isSelected = String(unit.id) === String(product.unitOfMeasurementId || '')

                                        return (
                                            <SelectItem key={unit.id} value={unit.id} className={isSelected ? "hidden" : ""}>
                                                {unit.name} ({unit.code})
                                            </SelectItem>
                                        )
                                    })}
                                </Select>

                                <Select
                                    aria-label="Tipo de Almacén"
                                    className="w-full -mt-4"
                                    label={
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-sm">Tipo de Almacén</p>
                                            <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                        </div>
                                    }
                                    classNames={{value: "text-background-500 !font-normal", trigger: "bg-background-100 data-[hover=true]:!bg-background-100 border-transparent", popoverContent: "bg-background-100 rounded-lg", selectorIcon: "!text-background-500"}}
                                    listboxProps={{
                                        itemClasses: {
                                            base: "!bg-transparent hover:!text-background-950/60 transition-colors duration-1000 ease-in-out",
                                        }
                                    }}
                                    name="warehouseTypeId"
                                    selectionMode="single"
                                    disallowEmptySelection
                                    selectorIcon={<ChevronDownFilled className="size-5"/>}
                                    labelPlacement="outside"
                                    radius="sm"
                                    variant="bordered"
                                    placeholder={action === "create" ? "Seleccione un tipo" : data?.warehouseTypeName}
                                    selectedKeys={product.warehouseTypeId ? new Set([String(product.warehouseTypeId)]) : new Set([])}
                                    onSelectionChange={(keys) => {
                                        const [first] = Array.from(keys)
                                        handleInputChange('warehouseTypeId', first)
                                    }}
                                    isDisabled={action !== 'create' && action !== 'update'}
                                    isInvalid={productErrors.warehouseTypeId.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {productErrors.warehouseTypeId.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                >
                                    {warehouseTypes.map((type) => {
                                        const isSelected = String(type.id) === String(product.warehouseTypeId || '')

                                        return (
                                            <SelectItem key={type.id} value={type.id} className={isSelected ? "hidden" : ""}>
                                                {type.name} ({type.code})
                                            </SelectItem>
                                        )
                                    })}
                                </Select>

                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Lote</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{product.lote.length + " / 100"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out group-data-[invalid=true]:!text-current font-medium !placeholder-background-500 placeholder:!font-normal", mainWrapper: "group-data-[invalid=true]:animate-shake", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary group-data-[invalid=true]:caret-danger bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary group-data-[invalid=true]:!border-danger border-transparent text-current" }}
                                    name="lote"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    variant="bordered"
                                    maxLength={100}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el lote" : data?.lote}
                                    value={product.lote}
                                    onValueChange={(value) => handleInputChange('lote', value)}
                                    isInvalid={productErrors.lote.length > 0}
                                    endContent={productErrors.lote.length === 0 && product.lote ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : productErrors.lote.length > 0 ? <DismissFilled className='size-4 text-danger' /> : null }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {productErrors.lote.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <p className="font-medium text-sm">Número de Serie</p>
                                            <p className="!text-background-500 text-xs font-normal">{(product.numeroSerie || "").length + " / 100"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current" }}
                                    name="numeroSerie"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    variant="bordered"
                                    maxLength={100}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el número de serie (Opcional)" : data?.numeroSerie || "Sin número de serie"}
                                    value={product.numeroSerie || ""}
                                    onValueChange={(value) => handleInputChange('numeroSerie', value)}
                                />

                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <div className="flex items-center gap-1">
                                                <p className="font-medium text-sm">Lote del Proveedor</p>
                                                <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                            </div>
                                            <p className="!text-background-500 text-xs font-normal">{product.loteProveedor.length + " / 100"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current" }}
                                    name="loteProveedor"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    variant="bordered"
                                    maxLength={100}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el lote del proveedor" : data?.loteProveedor}
                                    value={product.loteProveedor}
                                    onValueChange={(value) => handleInputChange('loteProveedor', value)}
                                    isInvalid={productErrors.loteProveedor.length > 0}
                                    endContent={productErrors.loteProveedor.length === 0 && product.loteProveedor ? <CheckmarkFilled className='size-4 text-background-500 group-data-[focus=true]:text-primary' /> : productErrors.loteProveedor.length > 0 ? <DismissFilled className='size-4 text-danger' /> : null }
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {productErrors.loteProveedor.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <p className="font-medium text-sm">Fabricante</p>
                                            <p className="!text-background-500 text-xs font-normal">{(product.fabricante || "").length + " / 255"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current" }}
                                    name="fabricante"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    variant="bordered"
                                    maxLength={255}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el fabricante (Opcional)" : data?.fabricante || "Sin fabricante"}
                                    value={product.fabricante || ""}
                                    onValueChange={(value) => handleInputChange('fabricante', value)}
                                />

                                <Input
                                    label={
                                        <div className="flex justify-between">
                                            <p className="font-medium text-sm">Distribuidor</p>
                                            <p className="!text-background-500 text-xs font-normal">{(product.distribuidor || "").length + " / 255"}</p>
                                        </div>
                                    }
                                    classNames={{ label: "w-full font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current" }}
                                    name="distribuidor"
                                    labelPlacement="outside"
                                    type="text"
                                    radius="sm"
                                    variant="bordered"
                                    maxLength={255}
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el distribuidor (Opcional)" : data?.distribuidor || "Sin distribuidor"}
                                    value={product.distribuidor || ""}
                                    onValueChange={(value) => handleInputChange('distribuidor', value)}
                                />

                                <Input
                                    label={
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-sm">Fecha de Ingreso</p>
                                            <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                        </div>
                                    }
                                    classNames={{ label: "font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current" }}
                                    name="fechaIngreso"
                                    labelPlacement="outside"
                                    type="date"
                                    radius="sm"
                                    variant="bordered"
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    value={product.fechaIngreso}
                                    onValueChange={(value) => handleInputChange('fechaIngreso', value)}
                                    isInvalid={productErrors.fechaIngreso.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {productErrors.fechaIngreso.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                <Input
                                    label={
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-sm">Fecha de Caducidad</p>
                                            <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                        </div>
                                    }
                                    classNames={{ label: "font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current" }}
                                    name="fechaCaducidad"
                                    labelPlacement="outside"
                                    type="date"
                                    radius="sm"
                                    variant="bordered"
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    value={product.fechaCaducidad}
                                    onValueChange={(value) => handleInputChange('fechaCaducidad', value)}
                                    isInvalid={productErrors.fechaCaducidad.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {productErrors.fechaCaducidad.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                <Input
                                    label={
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-sm">Cantidad</p>
                                            <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                        </div>
                                    }
                                    classNames={{ label: "font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current" }}
                                    name="cantidad"
                                    labelPlacement="outside"
                                    type="number"
                                    radius="sm"
                                    variant="bordered"
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese la cantidad" : data?.cantidad}
                                    value={product.cantidad}
                                    onValueChange={(value) => handleInputChange('cantidad', value)}
                                    isInvalid={productErrors.cantidad.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {productErrors.cantidad.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                <Input
                                    label={
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-sm">Cantidad Total</p>
                                            <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                        </div>
                                    }
                                    classNames={{ label: "font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current" }}
                                    name="cantidadTotal"
                                    labelPlacement="outside"
                                    type="number"
                                    radius="sm"
                                    variant="bordered"
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese la cantidad total" : data?.cantidadTotal}
                                    value={product.cantidadTotal}
                                    onValueChange={(value) => handleInputChange('cantidadTotal', value)}
                                    isInvalid={productErrors.cantidadTotal.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {productErrors.cantidadTotal.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />

                                <Input
                                    label={
                                        <div className="flex items-center gap-1">
                                            <p className="font-medium text-sm">Número de Contenedores</p>
                                            <TextAsteriskFilled className="size-3 text-background-500 group-data-[focus=true]:text-primary group-data-[invalid=true]:!text-danger"/>
                                        </div>
                                    }
                                    classNames={{ label: "font-medium !text-current transition-colors !duration-1000 ease-in-out", input: "transition-colors !duration-1000 ease-in-out font-medium !placeholder-background-500 placeholder:!font-normal", inputWrapper: "transition-colors !duration-1000 ease-in-out caret-primary bg-background-100 group-data-[hover=true]:border-background-200 group-data-[focus=true]:!border-primary border-transparent text-current" }}
                                    name="numeroContenedores"
                                    labelPlacement="outside"
                                    type="number"
                                    radius="sm"
                                    variant="bordered"
                                    isReadOnly={action !== 'create' && action !== 'update'}
                                    placeholder={action === "create" ? "Ingrese el número de contenedores" : data?.numeroContenedores}
                                    value={product.numeroContenedores}
                                    onValueChange={(value) => handleInputChange('numeroContenedores', value)}
                                    isInvalid={productErrors.numeroContenedores.length > 0}
                                    errorMessage={() => (
                                        <div className="flex text-danger">
                                            <ul>
                                                {productErrors.numeroContenedores.map((error, i) => (
                                                    <li key={i}>{error}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                />
                            </Form>

                            {(action === 'create' || action === 'update') && (
                                <div className="w-full flex justify-end py-8 sm:gap-4 gap-2">
                                    <Button
                                        className="tracking-wide font-medium data-[hover=true]:-translate-y-1"
                                        form="product-form"
                                        radius="sm"
                                        variant="shadow"
                                        color="primary"
                                        type="submit"
                                        startContent={!isLoading && <ArrowHookUpRightFilled className="size-5"/>}
                                        isLoading={isLoading}
                                        isDisabled={
                                            product.stockCatalogueId === "" || 
                                            product.productStatusId === "" || 
                                            product.unitOfMeasurementId === "" || 
                                            product.warehouseTypeId === "" || 
                                            product.lote === "" || 
                                            product.loteProveedor === "" || 
                                            product.fechaIngreso === "" || 
                                            product.fechaCaducidad === "" || 
                                            product.cantidad === "" || 
                                            product.cantidadTotal === "" || 
                                            product.numeroContenedores === "" ||
                                            Object.values(productErrors).some(err => err.length > 0)
                                        }
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            )}
                        </DrawerBody>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            <ProductsModal isOpen={isModalOpen} onOpenChange={onModalOpenChange} data={product} initialData={data} action={action} onRefresh={onRefresh} closeDrawer={() => {onOpenChange(false); resetForm()}}/>
        </>
    )
}
