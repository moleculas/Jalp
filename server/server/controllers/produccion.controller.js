import ProduccionTabla from "../models/ProduccionTabla";
import ProduccionInicial from "../models/ProduccionInicial";
import ProduccionPalet from "../models/ProduccionPalet";
import ProduccionSaldo from "../models/ProduccionSaldo";

export const getProduccionInicial = async (req, res) => {
    const { mes, anyo, productos } = JSON.parse(req.body.datos);
    try {
        const objetoProduccion = { inicial: [], saldo: [] };
        let id = "";
        for (let i = 0; i < productos.length; i++) {
            const produccionInicial = await ProduccionInicial.findOne(
                {
                    mes,
                    anyo,
                    producto: productos[i].producto,
                },
                {
                    createdAt: 0,
                    updatedAt: 0
                }
            );
            let newProduccionInicial;
            if (!produccionInicial) {
                newProduccionInicial = new ProduccionInicial({
                    producto: productos[i].producto,
                    familia: productos[i].familia,
                    mes,
                    anyo
                });
                await newProduccionInicial.save();
            };
            const produccionSaldo = await ProduccionSaldo.findOne(
                {
                    mes,
                    anyo,
                    producto: { $in: productos[i].serie }
                },
                {
                    createdAt: 0,
                    updatedAt: 0,
                }
            );
            let newProduccionSaldo;
            if (!produccionSaldo) {
                newProduccionSaldo = new ProduccionSaldo({
                    producto: productos[i].serie,
                    familia: productos[i].familia,
                    mes,
                    anyo
                });
                await newProduccionSaldo.save();
            };
            if (produccionInicial) {
                objetoProduccion.inicial.push(produccionInicial);
            } else {
                const newProduccionInicialARetornar = {
                    _id: newProduccionInicial._id,
                    mes: newProduccionInicial.mes,
                    anyo: newProduccionInicial.anyo,
                    stockInicial: newProduccionInicial.stockInicial,
                    producto: newProduccionInicial.producto,
                    familia: newProduccionInicial.familia,
                };
                objetoProduccion.inicial.push(newProduccionInicialARetornar);
            };
            if (produccionSaldo) {
                if (id !== produccionSaldo._id.toString()) {
                    objetoProduccion.saldo.push(produccionSaldo);
                };
                id = produccionSaldo._id.toString();
            } else {
                if (id !== newProduccionSaldo._id.toString()) {
                    const newProduccionSaldoARetornar = {
                        _id: newProduccionSaldo._id,
                        mes: newProduccionSaldo.mes,
                        anyo: newProduccionSaldo.anyo,
                        saldoInicial: newProduccionSaldo.saldoInicial,
                        producto: newProduccionSaldo.producto,
                        familia: newProduccionSaldo.familia,
                    };
                    objetoProduccion.saldo.push(newProduccionSaldoARetornar);
                };
                id = newProduccionSaldo._id.toString();
            };
        };
        return res.json(objetoProduccion);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    };
};

export const getProduccion = async (req, res) => {
    const { periodo, mes, anyo, producto, serie } = JSON.parse(req.body.datos);
    try {
        const objetoProduccion = { inicial: null, tabla: [], palet: [], saldo: null };
        let mesIterado = null;
        const semanas = periodo.map(semana => semana.semana);
        for (let i = 0; i < semanas.length; i++) {
            const produccionTabla = await ProduccionTabla.findOne(
                {
                    semana: semanas[i],
                    anyo,
                    producto
                },
                {
                    createdAt: 0,
                    updatedAt: 0,
                    familia: 0,
                    producto: 0
                }
            );
            if (!produccionTabla) {
                const newProduccionTabla = new ProduccionTabla({
                    producto: periodo[i].producto,
                    familia: periodo[i].familia,
                    semana: periodo[i].semana,
                    mes: periodo[i].mes,
                    anyo: periodo[i].anyo
                });
                await newProduccionTabla.save();
                const produccionPalet = await ProduccionPalet.findOne(
                    {
                        semana: semanas[i],
                        anyo
                    },
                    {
                        createdAt: 0,
                        updatedAt: 0,
                    }
                );
                let newProduccionPalet;
                if (!produccionPalet) {
                    newProduccionPalet = new ProduccionPalet({
                        semana: periodo[i].semana,
                        mes: periodo[i].mes,
                        anyo: periodo[i].anyo
                    });
                    await newProduccionPalet.save();
                };               
                if (mesIterado !== periodo[i].mes) {
                    const produccionInicial = await ProduccionInicial.findOne(
                        {
                            mes: periodo[i].mes,
                            anyo: periodo[i].anyo,
                            producto: periodo[i].producto,
                        },
                        {
                            createdAt: 0,
                            updatedAt: 0,
                            familia: 0,
                            producto: 0
                        }
                    );
                    let newProduccionInicial;
                    if (!produccionInicial) {
                        newProduccionInicial = new ProduccionInicial({
                            producto: periodo[i].producto,
                            familia: periodo[i].familia,
                            mes: periodo[i].mes,
                            anyo: periodo[i].anyo
                        });
                        await newProduccionInicial.save();
                    };
                    const produccionSaldo = await ProduccionSaldo.findOne(
                        {
                            mes: periodo[i].mes,
                            anyo: periodo[i].anyo,
                            producto: { $in: serie }
                        },
                        {
                            createdAt: 0,
                            updatedAt: 0,
                            producto: 0
                        }
                    );
                    let newProduccionSaldo;
                    if (!produccionSaldo) {
                        newProduccionSaldo = new ProduccionSaldo({
                            producto: serie,
                            mes: periodo[i].mes,
                            anyo: periodo[i].anyo,
                            familia: periodo[i].familia,
                        });
                        await newProduccionSaldo.save();
                    };                    
                    mesIterado = periodo[i].mes;
                    if (mesIterado === mes) {
                        if (produccionInicial) {
                            objetoProduccion.inicial = produccionInicial;
                        } else {
                            const newProduccionInicialARetornar = {
                                _id: newProduccionInicial._id,
                                mes: newProduccionInicial.mes,
                                anyo: newProduccionInicial.anyo,
                                stockInicial: newProduccionInicial.stockInicial
                            };
                            objetoProduccion.inicial = newProduccionInicialARetornar;
                        };
                        if (produccionSaldo) {
                            objetoProduccion.saldo = produccionSaldo;
                        } else {
                            const newProduccionSaldoARetornar = {
                                _id: newProduccionSaldo._id,
                                mes: newProduccionSaldo.mes,
                                anyo: newProduccionSaldo.anyo,
                                saldoInicial: newProduccionSaldo.saldoInicial
                            };
                            objetoProduccion.saldo = newProduccionSaldoARetornar;
                        };                       
                    };
                };
                if (produccionPalet) {
                    objetoProduccion.palet.push(produccionPalet);
                } else {
                    const newProduccionPaletARetornar = {
                        _id: newProduccionPalet._id,
                        semana: newProduccionPalet.semana,
                        mes: newProduccionPalet.mes,
                        anyo: newProduccionPalet.anyo
                    };
                    objetoProduccion.palet.push(newProduccionPaletARetornar);
                };
                const newProduccionTablaARetornar = {
                    _id: newProduccionTabla._id,
                    semana: newProduccionTabla.semana,
                    mes: newProduccionTabla.mes,
                    anyo: newProduccionTabla.anyo
                };                
                objetoProduccion.tabla.push(newProduccionTablaARetornar);
            } else {
                objetoProduccion.tabla.push(produccionTabla);
                const produccionPalet = await ProduccionPalet.findOne(
                    {
                        semana: semanas[i],
                        anyo
                    },
                    {
                        createdAt: 0,
                        updatedAt: 0,
                    }
                );
                objetoProduccion.palet.push(produccionPalet);
                if ((mes === periodo[i].mes) && !objetoProduccion.inicial) {
                    const produccionInicial = await ProduccionInicial.findOne(
                        {
                            mes,
                            anyo,
                            producto
                        },
                        {
                            createdAt: 0,
                            updatedAt: 0,
                            familia: 0,
                            producto: 0
                        }
                    );
                    objetoProduccion.inicial = produccionInicial;
                };
                if ((mes === periodo[i].mes) && !objetoProduccion.saldo) {
                    const produccionSaldo = await ProduccionSaldo.findOne(
                        {
                            mes,
                            anyo,
                            producto: { $in: serie }
                        },
                        {
                            createdAt: 0,
                            updatedAt: 0,
                            producto: 0,
                            familia: 0,
                        }
                    );
                    objetoProduccion.saldo = produccionSaldo;
                };
            };
        };
        return res.json(objetoProduccion);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    };
};

export const addProduccion = async (req, res) => {
    try {
        const { producto, familia, semana, mes, anyo } = req.body;
        const newProduccionTabla = new ProduccionTabla({ producto, familia, semana, mes, anyo });
        await newProduccionTabla.save();
        const newProduccionInicial = new ProduccionTabla({ producto, familia, semana, mes, anyo });
        await newProduccionInicial.save();
        return res.status(200);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    };
};

export const updateProduccionInicial = async (req, res) => {
    const { idInicial, idSaldo, stockInicial, saldoInicial } = JSON.parse(req.body.datos);
    const objetoProduccionInicial = { inicial: null, saldo: null };
    try {
        const updatedProduccionInicial = await ProduccionInicial.findByIdAndUpdate(
            idInicial,
            {
                $set: {
                    stockInicial
                }
            },
            {
                new: true,
            }
        );
        if (!updatedProduccionInicial) return res.sendStatus(404);
        await updatedProduccionInicial.save();
        objetoProduccionInicial.inicial = updatedProduccionInicial;
        const updatedProduccionSaldo = await ProduccionSaldo.findByIdAndUpdate(
            idSaldo,
            {
                $set: {
                    saldoInicial
                }
            },
            {
                new: true,
            }
        );
        if (!updatedProduccionSaldo) return res.sendStatus(404);
        await updatedProduccionSaldo.save();
        objetoProduccionInicial.saldo = updatedProduccionSaldo;
        return res.json(objetoProduccionInicial);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    };
};

const retornaSetArray = (array, i) => {
    const elSet = {};
    Number(array[i].serfocat) > 0 && (elSet['serfocat'] = array[i].serfocat);
    Number(array[i].masova) > 0 && (elSet['masova'] = array[i].masova);
    Number(array[i].faucher) > 0 && (elSet['faucher'] = array[i].faucher);
    Number(array[i].sala) > 0 && (elSet['sala'] = array[i].sala);
    Number(array[i].mp_u_f) > 0 && (elSet['mp_u_f'] = array[i].mp_u_f);
    Number(array[i].saldo) > 0 && (elSet['saldo'] = array[i].saldo);
    return elSet;
};

export const updateProduccionTabla = async (req, res) => {
    const { datosTabla, datosPalet } = JSON.parse(req.body.datos);
    const objetoProduccion = { tabla: [], palet: [] };
    try {
        const semanasTabla = datosTabla.map(semana => semana._id);
        const semanasPalet = datosPalet.map(semana => semana._id);
        for (let i = 0; i < semanasTabla.length; i++) {
            const elSet = retornaSetArray(datosTabla, i);
            const updatedProduccionTabla = await ProduccionTabla.findByIdAndUpdate(
                {
                    _id: semanasTabla[i]
                },
                {
                    $set: elSet
                },
                {
                    new: true,
                }
            );
            if (!updatedProduccionTabla) return res.sendStatus(404);
            objetoProduccion.tabla.push(updatedProduccionTabla);
            const updatedProduccionPalet = await ProduccionPalet.findByIdAndUpdate(
                {
                    _id: semanasPalet[i]
                },
                {
                    $set: { palets: datosPalet[i].palets }
                },
                {
                    new: true,
                }
            );
            if (!updatedProduccionPalet) return res.sendStatus(404);
            objetoProduccion.palet.push(updatedProduccionPalet);
        };
        return res.json(objetoProduccion);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    };
};

