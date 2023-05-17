use tonic::{Status, Code};

pub trait ToProtoId {
    fn to_proto_id(&self) -> String;
}
impl ToProtoId for i64 {
    fn to_proto_id(&self) -> String {
        let id_bytes = (self + OFFSET).to_ne_bytes();
        bs58::encode(id_bytes).into_string()
    }
}

pub trait ToDbId {
    fn to_db_id(&self) -> Result<i64, bs58::decode::Error>;
    fn to_db_id_or_err(&self, field_name: &str) -> Result<i64, Status>;
}
impl ToDbId for String {
    fn to_db_id(&self) -> Result<i64, bs58::decode::Error> {
        let id_bytes = bs58::decode(self).into_vec()?;
        let id = i64::from_ne_bytes(id_bytes.as_slice().try_into().unwrap_or([0; 8]));
        if id == 0 {
            return Err(bs58::decode::Error::InvalidCharacter {
                character: '0',
                index: 0,
            });
        }
        Ok(id - OFFSET)
    }

    fn to_db_id_or_err(&self, field_name: &str) -> Result<i64, Status> {
        match self.to_db_id() {
            Ok(id) => Ok(id),
            Err(_) => Err(Status::new(Code::InvalidArgument, format!("invalid_id_{}", field_name))),
        }
    }

}

const OFFSET: i64 = 7;
